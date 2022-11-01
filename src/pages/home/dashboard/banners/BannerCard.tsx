import { Banner, WithId } from '@appjusto/types';
import { Box, Image, Link } from '@chakra-ui/react';
import {
  AnalyticsLogData,
  useMeasurement,
} from 'app/api/measurement/useMeasurement';
import { isEqual } from 'lodash';
import React from 'react';

interface BannerCardProps {
  banner: WithId<Banner>;
  baseWidth: number;
}

const BannerCard = ({ banner, baseWidth }: BannerCardProps) => {
  // context
  const { analyticsLogEvent } = useMeasurement();
  // state
  const [imageUrl, setImageUrl] = React.useState<string>();
  // helpers
  const logData = {
    eventName: 'admin_banner_click',
    eventParams: {
      item_id: banner.id,
      description: banner.name,
    },
  } as AnalyticsLogData;
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
        maxH={{ base: '100px', md: '180px', lg: '180px' }}
        border="1px solid #C8D7CB"
        borderRadius="12px"
        boxShadow="2px 3px 12px rgba(100, 100, 111, 0.1)"
        overflow="hidden"
      >
        <Image src={imageUrl} w={{ base: `${baseWidth}px`, lg: '100%' }} />
      </Box>
    );
  }
  return (
    <Link
      href={banner.link}
      onClick={() => analyticsLogEvent(logData)}
      isExternal
    >
      <Box
        position="relative"
        w={{ base: `${baseWidth}px`, lg: '100%' }}
        minW={{ base: '320px', md: '700px', lg: '980px' }}
        borderRadius="12px"
        boxShadow="2px 3px 12px rgba(100, 100, 111, 0.1)"
        overflow="hidden"
      >
        <Image src={imageUrl} w={{ base: `${baseWidth}px`, lg: '100%' }} />
      </Box>
    </Link>
  );
};

const areEqual = (prevProps: BannerCardProps, nextProps: BannerCardProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(BannerCard, areEqual);
