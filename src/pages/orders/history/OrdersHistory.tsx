import { Box, Text } from '@chakra-ui/layout';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { OrdersHistoryTable } from './OrdersHistoryTable';

export const OrdersHistory = () => {
  const { orders } = useOrdersContext();
  return (
    <Box>
      <Text fontSize="3xl" fontWeight="700" color="black">
        {t('Histórico de pedidos')}
      </Text>
      <Text fontSize="sm">
        {t(
          'Veja aqui os pedidos feitos em seu restaurante. Nesta página você pode também cancelar pedidos.'
        )}
      </Text>
      <OrdersHistoryTable orders={orders} />
    </Box>
  );
};
