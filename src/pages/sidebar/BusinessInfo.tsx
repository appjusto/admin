import { Box, Circle, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import Image from '../../common/components/Image';
import { BusinessStatus } from './BusinessStatus';

const BusinessInfo = () => {
  const business = useContextBusiness();
  return (
    <Box>
      {business?.logo_url ? (
        <Box w="40px" h="40px">
          <Image src={business.logo_url} borderRadius="20px" eagerLoading />
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
