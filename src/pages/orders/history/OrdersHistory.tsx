import { Box } from '@chakra-ui/layout';
import PageHeader from 'pages/PageHeader';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { OrdersHistoryTable } from './OrdersHistoryTable';

export const OrdersHistory = () => {
  const { orders } = useOrdersContext();
  return (
    <Box>
      <PageHeader
        title={t('Histórico de pedidos')}
        subtitle={t(
          'Veja aqui os pedidos feitos em seu restaurante. Nesta página você pode também cancelar pedidos.'
        )}
      />
      <OrdersHistoryTable orders={orders} />
    </Box>
  );
};
