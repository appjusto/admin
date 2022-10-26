import { WithId } from '@appjusto/types';
import { Box, Image, Link } from '@chakra-ui/react';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';

interface BannerCardProps {
  banner: WithId<Banner>;
  baseWidth: number;
}

export const BannerCard = ({ banner, baseWidth }: BannerCardProps) => {
  // state
  const [imageUrl, setImageUrl] = React.useState<string>();
  // side effects
  React.useEffect(() => {
    if (!baseWidth || !banner.images) return;
    if (baseWidth < 700 && banner.images[0]) setImageUrl(banner.images![0]);
    else if (banner.images[1]) setImageUrl(banner.images[1]);
  }, [banner, baseWidth]);
  // UI
  if (!banner.link) {
    return (
      <Box
        position="relative"
        w={{ base: `${baseWidth}px`, lg: '100%' }}
        minW={{ base: '320px', md: '700px', lg: '980px' }}
        // border="1px solid #C8D7CB"
        borderRadius="12px"
        boxShadow="2px 3px 12px rgba(100, 100, 111, 0.1)"
        overflow="hidden"
      >
        <Image src={imageUrl} w={{ base: `${baseWidth}px`, lg: '100%' }} />
      </Box>
    );
  }
  return (
    <Link href={banner.link} isExternal>
      <Box
        position="relative"
        w={{ base: `${baseWidth}px`, lg: '100%' }}
        minW={{ base: '320px', md: '700px', lg: '980px' }}
        // border="1px solid #C8D7CB"
        borderRadius="12px"
        boxShadow="2px 3px 12px rgba(100, 100, 111, 0.1)"
        overflow="hidden"
      >
        <Image src={imageUrl} w={{ base: `${baseWidth}px`, lg: '100%' }} />
      </Box>
    </Link>
  );
};
