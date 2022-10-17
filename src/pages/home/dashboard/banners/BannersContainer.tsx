import { WithId } from '@appjusto/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, useMediaQuery } from '@chakra-ui/react';
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
  const [isMobile] = useMediaQuery('(max-width: 500px)');
  const [translateValue, setTranslateValue] = React.useState(0);
  // handlers
  const handleTranslate = React.useCallback(
    (direction: 'left' | 'right') => {
      const baseWidht = isMobile ? 320 : 980;
      setTranslateValue((prev) => {
        if (direction === 'right') {
          if (prev < baseWidht * 2) return prev + baseWidht;
          else return 0;
        } else {
          if (prev > 0) return prev - baseWidht;
          else return baseWidht * 2;
        }
      });
    },
    [isMobile]
  );
  // UI
  if (!banners) return <Box />;
  return (
    <Box mt="6" maxW="980px" pos="relative" overflow="hidden">
      <Flex
        flexDir="row"
        transform={`translateX(-${translateValue}px)`}
        transition="transform 1s ease"
      >
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
      </Flex>
      <Flex
        pos="absolute"
        top="0"
        w="100%"
        h="100%"
        px="2"
        justifyContent="space-between"
        alignItems="center"
      >
        <Icon
          as={ChevronLeftIcon}
          color="white"
          w="32px"
          h="32px"
          cursor="pointer"
          onClick={() => handleTranslate('left')}
        />
        <Icon
          as={ChevronRightIcon}
          color="white"
          w="32px"
          h="32px"
          cursor="pointer"
          onClick={() => handleTranslate('right')}
        />
      </Flex>
    </Box>
  );
};
