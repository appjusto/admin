import { Circle, Flex, SquareProps, Text } from '@chakra-ui/react';
import { useOrdersContext } from 'app/state/order';
import { t } from 'utils/i18n';

export const BusinessStatus = (props: SquareProps) => {
  // context
  const { isBusinessOpen } = useOrdersContext();
  // UI
  return (
    <Flex mt="1" alignItems="center">
      <Circle size="8px" bg={isBusinessOpen ? 'green.500' : 'red'} {...props} />
      <Text fontSize="md" ml="2">
        {isBusinessOpen ? t('Aberto agora') : t('Fechado')}
      </Text>
    </Flex>
  );
};
