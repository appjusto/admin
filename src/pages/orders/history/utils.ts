import { Fare, Order, WithId } from '@appjusto/types';
import dayjs from 'dayjs';
import { orderStatusPTOptionsForTableItem } from 'pages/backoffice/utils';
import { getDateAndHour } from 'utils/functions';

const serializeValue = (value: number) =>
  (value / 100).toString().replace('.', ',');

const getOrderValue = (fare?: Fare) => {
  let businessValue = fare?.business?.value ?? 0;
  // if outsourced by business it should be added to courier`s value
  if (fare?.courier?.payee === 'business') {
    businessValue += fare?.courier?.value ?? 0;
  }
  // return business total value
  return serializeValue(businessValue);
};
const getOrderNetValue = (fare?: Fare) => {
  let businessValue = fare?.business?.netValue ?? 0;
  // if outsourced by business it should be added to courier`s netValue
  if (fare?.courier?.payee === 'business') {
    businessValue += fare?.courier?.netValue ?? 0;
  }
  // return business total value
  return serializeValue(businessValue);
};
const getOrderIuguValue = (fare?: Fare) => {
  // business value to display in admin drawer and table items
  let result = fare?.business?.processing?.value ?? 0;
  // if outsourced by business it should be added to courier`s value
  if (fare?.courier?.payee === 'business') {
    result += fare?.courier?.processing?.value ?? 0;
  }
  // return business total value
  return serializeValue(result);
};
const getOrderAppJustoComission = (fare?: Fare) => {
  // business value to display in admin drawer and table items
  let result = fare?.business?.commission ?? 0;
  result = fare?.business?.insurance ?? 0;
  // return business total value
  return serializeValue(result);
};

const getPaymentDate = (order: WithId<Order>): string => {
  const { paymentMethod, timestamps, scheduledTo } = order;
  if (paymentMethod === 'pix') {
    return getDateAndHour(timestamps.confirmed, true);
  } else if (paymentMethod === 'credit_card') {
    if (scheduledTo) {
      const date = dayjs(timestamps.confirmed?.toDate())
        .add(30, 'day')
        .toDate();
      return getDateAndHour(date, true);
    } else {
      const date = dayjs(timestamps.delivered?.toDate())
        .add(30, 'day')
        .toDate();
      return getDateAndHour(date, true);
    }
  }
  return 'Não encontrado';
};

const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Criado em', key: 'charged' },
  { label: 'Agendado para', key: 'scheduledTo' },
  { label: 'Entregue em', key: 'delivered' },
  { label: 'Status', key: 'status' },
  { label: 'Valor dos produtos', key: 'value' },
  { label: 'Taxa (IUGU)', key: 'iugu' },
  { label: 'Comissão (AppJusto)', key: 'appjusto' },
  { label: 'Valor líquido', key: 'netValue' },
  { label: 'Método de pagamento', key: 'paymentMethod' },
  { label: 'Data de recebimento', key: 'paymentDate' },
];

export const getOrdersCsvData = (orders?: WithId<Order>[]) => {
  if (!orders) return { headers, data: [] };
  const data = orders.map((order) => {
    // helpers
    const charged = getDateAndHour(order.timestamps.charged);
    const scheduledTo = order.scheduledTo
      ? getDateAndHour(order.scheduledTo)
      : 'Tempo real';
    const delivered = order.timestamps.delivered
      ? getDateAndHour(order.timestamps.delivered)
      : 'Não encontrado';
    const status = orderStatusPTOptionsForTableItem[order.status];
    const value = getOrderValue(order.fare);
    const iugu = getOrderIuguValue(order.fare);
    const appjusto = getOrderAppJustoComission(order.fare);
    const netValue = getOrderNetValue(order.fare);
    const paymentMethod = order.paymentMethod ?? 'Não encontrado';
    const paymentDate = getPaymentDate(order);
    return {
      id: order.code,
      charged,
      scheduledTo,
      delivered,
      status,
      value,
      iugu,
      appjusto,
      netValue,
      paymentMethod,
      paymentDate,
    };
  });
  return { headers, data };
};
