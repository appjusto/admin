import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { Order, WithId } from 'appjusto-types';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemPros {
  order: WithId<Order>;
}

const ConsumerOrdersTableItem = ({ order }: ItemPros) => {
  const date = getDateAndHour(order.createdOn);
  return (
    <Tr color="black" fontSize="xs">
      <Td>{order.code ?? 'N/E'}</Td>
      <Td>{date}</Td>
      <Td>{order.business?.name ?? 'N/I'}</Td>
      <Td>{order.fare?.total ? formatCurrency(order.fare.total) : 'N/E'}</Td>
    </Tr>
  );
};

export const ConsumerOrders = () => {
  // context
  const { orders } = useContextConsumerProfile();
  // helpers
  const totalOrders = orders.length ?? '0';
  // UI
  return (
    <>
      <Text fontSize="20px" lineHeight="26px" color="black">
        {`${totalOrders} pedidos realizados`}
      </Text>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data')}</Th>
            <Th>{t('Restaurante')}</Th>
            <Th>{t('Valor')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              return <ConsumerOrdersTableItem key={order.id} order={order} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não há pedidos no momento.')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
};
