import { Order, WithId } from '@appjusto/types';
import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { OrdersTableItem } from './OrdersTableItem';
import { getOrdersTableTotal } from './utils';

interface OrdersTableProps {
  orders?: WithId<Order>[] | null;
  isBackoffice?: boolean;
}

export const OrdersTable = ({ orders, isBackoffice }: OrdersTableProps) => {
  // helpers
  const totalValue = isBackoffice ? 0 : getOrdersTableTotal(orders);
  // UI
  return (
    <>
      <Box mt="12" maxW="100vw" overflowX="auto">
        <Table mt="4" size="md" variant="simple" pos="relative">
          <Thead>
            <Tr>
              <Th>{t('ID')}</Th>
              <Th>{t('Atualizado em')}</Th>
              <Th>{t('Agendado para')}</Th>
              {isBackoffice && <Th>{t('Tipo')}</Th>}
              <Th>{t('Status')}</Th>
              {isBackoffice && <Th>{t('Restaurante')}</Th>}
              <Th>{t('Cliente')}</Th>
              <Th>{t('Entregador')}</Th>
              <Th>{t('Valor')}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                return (
                  <OrdersTableItem
                    key={order.id}
                    order={order}
                    isBackoffice={isBackoffice}
                  />
                );
              })
            ) : (
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td>{t('Sem resultados para o número informado')}</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
          {!isBackoffice && (
            <Tfoot bgColor="gray.50">
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td>{t('Total:')}</Td>
                <Td>{formatCurrency(totalValue)}</Td>
                <Td></Td>
              </Tr>
            </Tfoot>
          )}
        </Table>
      </Box>
      <Text mt="4" fontSize="sm">
        {t('(FR) = Fora da rede.')}
      </Text>
    </>
  );
};
