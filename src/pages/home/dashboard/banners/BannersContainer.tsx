import { WithId } from '@appjusto/types';
import { Box, Flex, keyframes } from '@chakra-ui/react';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import { BannerCard } from './BannerCard';

interface BannersProps {
  banners?: WithId<Banner>[] | null;
}

const slide = keyframes`
    from {transform: translateX(0px);}
    to {transform: translateX(-980px)}
  `;

export const BannersContainer = ({ banners }: BannersProps) => {
  // animation
  const slideAnimation = `${slide} 3s ease 12s infinite`;
  // UI
  if (!banners) return <Box />;
  return (
    <Box mt="6" maxW="980px" overflow="hidden">
      <Flex flexDir="row" animation={slideAnimation}>
        {banners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
      </Flex>
    </Box>
  );
};
