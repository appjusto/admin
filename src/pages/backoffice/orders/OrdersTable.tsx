import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { t } from 'utils/i18n';
import { OrdersTableItem } from './OrdersTableItem';

interface OrdersTableProps {
  orders?: WithId<Order>[] | null;
}

export const OrdersTable = ({ orders }: OrdersTableProps) => {
  // context

  // UI
  return (
    <Box mt="12" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data')}</Th>
            <Th>{t('Status')}</Th>
            <Th>{t('Cliente')}</Th>
            <Th>{t('Entregador')}</Th>
            <Th>{t('Valor')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              return <OrdersTableItem key={order.id} order={order} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o número informado')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
