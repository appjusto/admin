import { Circle, Flex, SquareProps, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { t } from 'utils/i18n';

export const BusinessStatus = (props: SquareProps) => {
  // context
  const { business } = useContextBusiness();
  // UI
  return (
    <Flex alignItems="center">
      <Circle size="8px" bg={business?.status === 'open' ? 'green.500' : 'red'} {...props} />
      <Text fontSize="md" ml="2">
        {business?.status === 'open' ? (
          <Text as="span">{t('Aberto agora')}</Text>
        ) : (
          <Text as="span">{t('Fechado')}</Text>
        )}
      </Text>
    </Flex>
  );
};
