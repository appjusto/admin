import { Order, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { OrdersTableItem } from './OrdersTableItem';

interface OrdersTableProps {
  orders?: WithId<Order>[] | null;
  isBackoffice?: boolean;
}

export const OrdersTable = ({ orders, isBackoffice }: OrdersTableProps) => {
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
              <Th isNumeric>{t('Valor')}</Th>
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
                <Td isNumeric></Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <Text mt="4" fontSize="sm">
        {t('(FR) = Fora da rede.')}
      </Text>
    </>
  );
};
