import { WithId } from '@appjusto/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Icon } from '@chakra-ui/react';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';
import { BannerCard } from './BannerCard';

const renderCarouselSection = (
  banners: WithId<Banner>[],
  baseWidth: number
) => {
  // state
  if (banners.length === 1) {
    const banner = banners[0];
    return <BannerCard key={banner.id} banner={banner} baseWidth={baseWidth} />;
  }
  const items = banners.concat(banners).concat(banners);
  return items.map((banner, index) => {
    return (
      <BannerCard
        key={`${banner.id}-${index}`}
        banner={banner}
        baseWidth={baseWidth}
      />
    );
  });
};

interface BannersProps {
  banners?: WithId<Banner>[] | null;
}

// const slide = (start: number, width: number) => keyframes`
//     from {transform: translateX(${start}px);}
//     to {transform: translateX(-${start + width}px)}
//   `;

export const BannersContainer = ({ banners }: BannersProps) => {
  // state
  const [baseWidth, setBaseWidth] = React.useState(0);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [transition, setTransition] = React.useState('');
  const [translateValue, setTranslateValue] = React.useState<number>();
  // refs
  const sliderRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const setInitialtransition = React.useCallback(() => {
    if (!banners || banners.length < 2) return;
    if (!baseWidth) return;
    const initialtranslate = baseWidth * banners.length;
    if (
      !translateValue ||
      translateValue === 0 ||
      translateValue === initialtranslate * 2
    ) {
      setTransition('');
      setTranslateValue(initialtranslate);
    }
  }, [banners, baseWidth, translateValue]);
  const handleTranslate = React.useCallback(
    (direction: 'left' | 'right', auto?: boolean) => {
      if (!banners || banners.length < 2) return;
      if (!baseWidth) return;
      if (auto && !autoPlay) return;
      setTranslateValue((prev) => {
        if (!prev) return;
        if (direction === 'right') {
          return prev + baseWidth;
        } else {
          return prev - baseWidth;
        }
      });
    },
    [banners, baseWidth, autoPlay]
  );
  // console.log('baseWidth', baseWidth);
  console.log('tValue', translateValue);
  React.useEffect(() => {
    const handleResizing = () => {
      if (typeof window !== 'undefined') {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        const baseWidth = clientWidth > 1000 ? 980 : clientWidth - 32;
        setBaseWidth(baseWidth);
      }
    };
    handleResizing();
    window.addEventListener('resize', handleResizing);
    return () => window.removeEventListener('resize', handleResizing);
  }, []);
  React.useEffect(() => {
    if (!banners) return;
    if (banners.length < 2) {
      setTranslateValue(0);
      return;
    }
    if (!baseWidth) return;
    const initialtranslate = baseWidth * banners.length;
    const restart = () =>
      setTimeout(() => {
        setInitialtransition();
      }, 2000);
    if (!translateValue || translateValue === initialtranslate * 2) restart();
    else if (translateValue === 0) restart();
    else {
      setTransition('transform 2s ease');
    }
  }, [banners, baseWidth, translateValue, transition, setInitialtransition]);
  React.useEffect(() => {
    if (!banners || banners.length < 2) return;
    const interval = setInterval(() => {
      handleTranslate('right', true);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners, handleTranslate]);
  // UI
  if (!banners || translateValue === undefined) return <Box />;
  return (
    <Box
      mt="6"
      w="100%"
      maxW="980px"
      pos="relative"
      overflow="hidden"
      onMouseOver={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <Flex
        ref={sliderRef}
        flexDir="row"
        transform={`translateX(-${translateValue}px)`}
        transition={transition}
      >
        {renderCarouselSection(banners, baseWidth)}
      </Flex>
      {banners.length > 1 && (
        <>
          <Center pos="absolute" top="0" left="0" w="auto" h="100%">
            <Icon
              as={ChevronLeftIcon}
              color="white"
              w="32px"
              h="32px"
              cursor="pointer"
              onClick={() => handleTranslate('left')}
            />
          </Center>
          <Center pos="absolute" top="0" right="0" w="auto" h="100%">
            <Icon
              as={ChevronRightIcon}
              color="white"
              w="32px"
              h="32px"
              cursor="pointer"
              onClick={() => handleTranslate('right')}
            />
          </Center>
        </>
      )}
    </Box>
  );
};
