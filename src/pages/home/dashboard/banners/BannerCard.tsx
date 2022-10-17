import { WithId } from '@appjusto/types';
import { Box, Image, Link } from '@chakra-ui/react';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';

interface BannerCardProps {
  banner: WithId<Banner>;
}

export const BannerCard = ({ banner }: BannerCardProps) => {
  // state
  const [imageUrl, setImageUrl] = React.useState<string>();
  // helpers
  const link =
    banner.target === 'inner-page'
      ? `https://appjusto.com.br/banner/${banner.slug}`
      : banner.link;
  // handlers
  const updateImageUrl = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (width < 700 && banner.images && banner.images[0])
        setImageUrl(banner.images![0]);
      else if (banner.images && banner.images[1]) setImageUrl(banner.images[1]);
    }
  }, [banner]);
  // side effects
  React.useEffect(() => {
    updateImageUrl();
    window.addEventListener('resize', updateImageUrl);
    return () => window.removeEventListener('resize', updateImageUrl);
  }, [updateImageUrl]);
  // UI
  return (
    <Link href={link} isExternal>
      <Box
        position="relative"
        w="100%"
        minW={{ base: '320px', md: '600px', lg: '980px' }}
        // border="1px solid #C8D7CB"
        borderRadius="12px"
        boxShadow="2px 3px 12px rgba(100, 100, 111, 0.1)"
        overflow="hidden"
      >
        <Image src={imageUrl} />
      </Box>
    </Link>
  );
};
