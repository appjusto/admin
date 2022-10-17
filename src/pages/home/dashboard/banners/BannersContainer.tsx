import { WithId } from '@appjusto/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Icon } from '@chakra-ui/react';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';
import { BannerCard } from './BannerCard';

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
  const [translateValue, setTranslateValue] = React.useState(0);
  // refs
  const sliderRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const handleTranslate = React.useCallback(
    (direction: 'left' | 'right') => {
      setTranslateValue((prev) => {
        if (direction === 'right') {
          if (prev < baseWidth * 2) return prev + baseWidth;
          else return 0;
        } else {
          if (prev > 0) return prev - baseWidth;
          else return baseWidth * 2;
        }
      });
    },
    [baseWidth]
  );
  React.useEffect(() => {
    const handleResizing = () => {
      if (typeof window !== 'undefined') {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        console.log('clientWidth', clientWidth);
        const baseWidth = clientWidth < 760 ? clientWidth - 32 : 980;
        setBaseWidth(baseWidth);
      }
    };
    handleResizing();
    window.addEventListener('resize', handleResizing);
    return () => window.removeEventListener('resize', handleResizing);
  }, []);
  // UI
  if (!banners) return <Box />;
  return (
    <Box mt="6" w="100%" maxW="980px" pos="relative" overflow="hidden">
      <Flex
        ref={sliderRef}
        flexDir="row"
        transform={`translateX(-${translateValue}px)`}
        transition="transform 1s ease"
      >
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} baseWidth={baseWidth} />
        ))}
      </Flex>
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
    </Box>
  );
};
