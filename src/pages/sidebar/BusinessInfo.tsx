import { Box, Circle, Text } from '@chakra-ui/react';
import React from 'react';
import { useBusinessValue } from 'state/business/business';
import { t } from 'utils/i18n';

const BusinessInfo = () => {
  const business = useBusinessValue();
  return (
    <Box>
      <Circle size="40px" bg="gray.400" />
      <Text fontSize="md" mt="2">
        {business?.name}
      </Text>
      <Box d="flex" mt="0" alignItems="center">
        <Circle size="8px" bg={business?.status === 'open' ? 'green.500' : 'red'} />
        <Text fontSize="md" ml="2">
          {business?.status === 'open' ? t('Aberto agora') : t('Fechado')}
        </Text>
      </Box>
    </Box>
  );
};

export default BusinessInfo;
