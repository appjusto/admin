import { Order, OrderStatus, WithId } from '@appjusto/types';
import TableItem from 'common/components/backoffice/TableItem';
import { useRouteMatch } from 'react-router';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { orderStatusPTOptionsForTableItem } from '../utils';
import { getFoodOrderTotal } from './utils';

interface ItemProps {
  order: WithId<Order>;
  isBackoffice?: boolean;
}

export const OrdersTableItem = ({ order, isBackoffice }: ItemProps) => {
  // context
  const { path } = useRouteMatch();
  // helpers
  const total = getFoodOrderTotal(order, isBackoffice);
  // UI
  return (
    <TableItem
      key={order.id}
      link={`${path}/${order.id}`}
      columns={[
        { value: order.code ?? 'N/I', styles: { maxW: '120px' } },
        { value: getDateAndHour(order.updatedOn) },
        {
          value: order.scheduledTo
            ? getDateAndHour(order.scheduledTo)
            : 'Tempo real',
        },
        {
          value: order.type
            ? order.type === 'food'
              ? 'Comida'
              : 'Entrega'
            : 'N/E',
        },
        {
          value: order.status
            ? orderStatusPTOptionsForTableItem[order.status as OrderStatus]
            : 'N/I',
        },
        {
          value: order.business?.name ?? 'Não se aplica',
          styles: { color: order.type === 'p2p' ? 'gray.500' : 'inherit' },
        },
        { value: order.consumer.name ?? 'N/I' },
        {
          value:
            order.dispatchingStatus === 'outsourced'
              ? `(FR) ${order.courier?.name ?? 'N/E'}`
              : order.fulfillment === 'take-away'
              ? 'Não se aplica'
              : order.courier?.name ?? 'N/E',
          styles: {
            color: order.fulfillment === 'take-away' ? 'gray.500' : 'inherit',
          },
        },
        { value: formatCurrency(total) },
      ]}
    />
  );
};
