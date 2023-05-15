import { Order, WithId } from '@appjusto/types';
import { getFoodOrderTotal } from 'pages/backoffice/orders/utils';
import { orderStatusPTOptionsForTableItem } from 'pages/backoffice/utils';
import { getDateAndHour } from 'utils/functions';

const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Criado em', key: 'createdAt' },
  { label: 'Agendado para', key: 'scheduledTo' },
  { label: 'Status', key: 'status' },
  { label: 'Cliente', key: 'consumer' },
  { label: 'Entregador', key: 'courier' },
  { label: 'Valor', key: 'value' },
];

export const getOrdersCsvData = (orders?: WithId<Order>[]) => {
  if (!orders) return { headers, data: [] };
  const data = orders.map((order) => {
    const total = (getFoodOrderTotal(order, false) / 100)
      .toString()
      .replace('.', ',');
    return {
      id: order.code,
      createdAt: getDateAndHour(order.timestamps.charged),
      scheduledTo: order.scheduledTo
        ? getDateAndHour(order.scheduledTo)
        : 'Tempo real',
      status: orderStatusPTOptionsForTableItem[order.status],
      consumer: order.consumer.name ?? 'N/I',
      courier:
        order.dispatchingStatus === 'outsourced'
          ? `(FR) ${order.courier?.name ?? 'N/E'}`
          : order.fulfillment === 'take-away'
          ? 'Não se aplica'
          : order.courier?.name ?? 'N/E',
      value: total,
    };
  });
  return { headers, data };
};
