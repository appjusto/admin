import { Order, WithId } from '@appjusto/types';
import { Center, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrdersKanbanList } from './OrdersKanbanList';

interface OrderSearchProps {
  orders: WithId<Order>[];
}

interface SplitedOrderGroup {
  date: string;
  orders: WithId<Order>[];
}

const getOrdersByDay = (orders: WithId<Order>[]) => {
  return orders.reduce<SplitedOrderGroup[]>((result, order) => {
    const scheduledTo = order.scheduledTo ? getDateAndHour(order.scheduledTo, true) : null;
    if(!scheduledTo) return result;
    const currentGroup = result.find(group => group.date === scheduledTo);
    if(currentGroup) {
      currentGroup.orders.push(order);
      return result;
    }
    const newGroup = { date: scheduledTo, orders: [order]}
    return [...result, newGroup];
  }, []);
}

export const ScheduledOrders = ({ orders }: OrderSearchProps) => {
  // helpers
  const splitedByDay = getOrdersByDay(orders);
  console.log("splitedByDay", splitedByDay)
  // UI
  if(splitedByDay.length === 0) {
    return (
      <Center w="100%" h="300px">
        <Text textColor="gray.700">{t('Nenhum pedido agendado para esta semana')}</Text>
      </Center>
    )
  }
  return (
    <Wrap mt="8">
      {
        splitedByDay.map(group => (
          <WrapItem key={group.orders[0].id}>
            <OrdersKanbanList
              title={group.date}
              orders={group.orders}
              minW={{ lg: '260px' }}
            />
          </WrapItem>
        ))
      }
    </Wrap>
  );
};
