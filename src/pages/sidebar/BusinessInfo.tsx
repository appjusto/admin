import { Box, Circle, Image, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { ImageFbLoading } from 'common/components/ImageFbLoading';
import React from 'react';
import { BusinessStatus } from './BusinessStatus';

const BusinessInfo = () => {
  const { business } = useContextBusiness();
  const { logo } = useBusinessProfile();
  return (
    <Box>
      {business?.logoExists && logo ? (
        <Box w="40px" h="40px">
          <Image
            src={logo}
            borderRadius="20px"
            fallback={<ImageFbLoading w="40px" h="40px" borderRadius="20px" />}
          />
        </Box>
      ) : (
        <Circle size="40px" bg="gray.400" />
      )}
      <Text fontSize="md" mt="2">
        {business?.name}
      </Text>
      <BusinessStatus />
    </Box>
  );
};

export default BusinessInfo;
