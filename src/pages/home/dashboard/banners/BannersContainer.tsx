import { Banner, WithId } from '@appjusto/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Icon } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React from 'react';
import BannerCard from './BannerCard';

const renderCarouselSection = (
  banners: WithId<Banner>[],
  baseWidth: number
) => {
  // UI
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

const BannersContainer = ({ banners }: BannersProps) => {
  // state
  const [baseWidth, setBaseWidth] = React.useState(0);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [actionEnabled, setActionEnabled] = React.useState(true);
  const [transition, setTransition] = React.useState('');
  const [translateValue, setTranslateValue] = React.useState<number>();
  // refs
  const sliderRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const initialize = React.useCallback(
    (width: number) => {
      if (!banners) return;
      const initialtranslate = banners.length > 1 ? width * banners.length : 0;
      setTransition('');
      setTranslateValue(initialtranslate);
    },
    [banners]
  );
  const handleTranslate = React.useCallback(
    (multiplier: number, auto?: boolean) => {
      if (!banners || banners.length < 2) return;
      if (!baseWidth) return;
      if (auto && !autoPlay) return;
      if (!auto) {
        setActionEnabled(false);
        setTimeout(() => setActionEnabled(true), 2000);
      }
      const direction = baseWidth * multiplier;
      setTranslateValue((prev) => {
        if (!prev) return;
        return prev + direction;
      });
    },
    [banners, baseWidth, autoPlay]
  );
  React.useEffect(() => {
    const handleResizing = () => {
      if (typeof window !== 'undefined') {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        const baseWidth = clientWidth > 1000 ? 980 : clientWidth - 32;
        setBaseWidth(baseWidth);
        initialize(baseWidth);
      }
    };
    handleResizing();
    window.addEventListener('resize', handleResizing);
    return () => window.removeEventListener('resize', handleResizing);
  }, [initialize]);
  React.useEffect(() => {
    if (!baseWidth) return;
    if (!banners) return;
    if (banners.length < 2) {
      setTranslateValue(0);
      return;
    }
    const initialtranslate = baseWidth * banners.length;
    const restart = () =>
      setTimeout(() => {
        setTransition('');
        setTranslateValue(initialtranslate);
      }, 2000);
    if (!translateValue || translateValue === initialtranslate * 2) restart();
    else if (translateValue === 0) restart();
    else {
      setTransition('transform 2s ease');
    }
  }, [baseWidth, banners, translateValue]);
  React.useEffect(() => {
    if (!banners || banners.length < 2) return;
    const interval = setInterval(() => {
      handleTranslate(1, true);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners, handleTranslate]);
  // UI
  if (!banners || banners.length === 0 || translateValue === undefined)
    return <Box />;
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
      <Center pos="absolute" top="0" left="0" w="32px" h="100%">
        {banners.length > 1 && actionEnabled && (
          <Icon
            as={ChevronLeftIcon}
            color="white"
            w="32px"
            h="32px"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            onClick={() => handleTranslate(-1)}
          />
        )}
      </Center>
      <Center pos="absolute" top="0" right="0" w="32px" h="100%">
        {banners.length > 1 && actionEnabled && (
          <Icon
            as={ChevronRightIcon}
            color="white"
            w="32px"
            h="32px"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            onClick={() => handleTranslate(1)}
          />
        )}
      </Center>
    </Box>
  );
};

const areEqual = (prevProps: BannersProps, nextProps: BannersProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(BannersContainer, areEqual);
