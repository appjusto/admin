import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { OrderAlgolia } from 'appjusto-types/algolia';
import { t } from 'utils/i18n';
import { OrdersTableItem } from './OrdersTableItem';

interface OrdersTableProps {
  orders: OrderAlgolia[] | undefined;
}

export const OrdersTable = ({ orders }: OrdersTableProps) => {
  // context

  // UI
  return (
    <Box mt="12">
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data')}</Th>
            <Th>{t('Cliente')}</Th>
            <Th>{t('Entregador')}</Th>
            <Th>{t('Valor')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              return <OrdersTableItem key={order.objectID} order={order} />;
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
