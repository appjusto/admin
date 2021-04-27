import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useContextConsumerProfile } from 'app/state/consumer/context';
import { Order, WithId } from 'appjusto-types';
import { getDateAndHour, getOrderTotalPriceToDisplay } from 'utils/functions';
import { t } from 'utils/i18n';

interface ItemPros {
  order: WithId<Order>;
}

const ConsumerOrdersTableItem = ({ order }: ItemPros) => {
  const onboarding = order.createdOn
    ? getDateAndHour(order.createdOn as firebase.firestore.Timestamp)
    : 'N/E';
  const totalValue = getOrderTotalPriceToDisplay(order.items ?? []);
  return (
    <Tr color="black" fontSize="xs">
      <Td>{order.code ?? 'N/E'}</Td>
      <Td>{onboarding}</Td>
      <Td>{order.business?.name ?? 'N/I'}</Td>
      <Td>{totalValue}</Td>
    </Tr>
  );
};

export const ConsumerOrders = () => {
  // context
  const { orders } = useContextConsumerProfile();

  // helpers
  const totalOrders = orders.length ?? '0';
  return (
    <>
      <Text fontSize="20px" lineHeight="26px" color="black">
        {`${totalOrders} pedidos realizados`}
      </Text>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('ID')}</Th>
            <Th>{t('Data do onboarding')}</Th>
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
