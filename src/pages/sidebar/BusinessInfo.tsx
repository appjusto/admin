import { Box, Circle, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { BusinessStatus } from './BusinessStatus';

const BusinessInfo = () => {
  const business = useContextBusiness();
  return (
    <Box>
      <Circle size="40px" bg="gray.400" />
      <Text fontSize="md" mt="2">
        {business?.name}
      </Text>
      <BusinessStatus />
    </Box>
  );
};

export default BusinessInfo;
