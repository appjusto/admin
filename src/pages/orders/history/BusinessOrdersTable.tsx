import { Order, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { BusinessOrdersTableItem } from './BusinessOrdersTableItem';

interface BusinessOrdersTableProps {
  orders?: WithId<Order>[] | null;
}

export const BusinessOrdersTable = ({ orders }: BusinessOrdersTableProps) => {
  // UI
  return (
    <>
      <Box mt="12" maxW="100vw" overflowX="auto">
        <Table mt="4" size="md" variant="simple" pos="relative">
          <Thead>
            <Tr>
              <Th>{t('ID')}</Th>
              <Th>{t('Criado em')}</Th>
              <Th>{t('Agendado para')}</Th>
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
                return <BusinessOrdersTableItem key={order.id} order={order} />;
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
        </Table>
      </Box>
      <Text mt="4" fontSize="sm">
        {t('(FR) = Fora da rede.')}
      </Text>
    </>
  );
};
