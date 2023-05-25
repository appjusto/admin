import { Fare, FareDetails, Order, WithId } from '@appjusto/types';
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
  return serializeValue(businessValue);
};
const getOrderIuguValue = (fare?: Fare) => {
  let result = fare?.business?.processing?.value ?? 0;
  // if outsourced by business it should be added to courier`s value
  if (fare?.courier?.payee === 'business') {
    result += fare?.courier?.processing?.value ?? 0;
  }
  return { iugu: serializeValue(result), iuguNumber: result };
};
const getOrderAppJustoComission = (fare?: Fare) => {
  // business value to display in admin drawer and table items
  let result = fare?.business?.commission ?? 0;
  result += fare?.business?.insurance ?? 0;
  return { appjusto: serializeValue(result), appjustoNumber: result };
};
const getOrderNetValue = (
  fare: Fare | undefined,
  iugu: number,
  appjusto: number,
  extras: number
) => {
  let businessValue = fare?.business?.paid ?? 0;
  // if order was paid
  if (businessValue > 0) {
    businessValue -= iugu + appjusto;
    // if outsourced by business it should be added to courier`s netValue
    if (fare?.courier?.payee === 'business') {
      businessValue += fare?.courier?.paid ?? 0;
    }
  }
  businessValue += extras;
  return serializeValue(businessValue);
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

const getOrderExtrasValue = (businessFare?: FareDetails | null) => {
  if (!businessFare || !businessFare.extras)
    return { extras: '0', extrasNumber: 0 };
  const { extras: businessExtras } = businessFare;
  const result = businessExtras.reduce((total, extra) => {
    return (total += extra.value);
  }, 0);
  return { extras: serializeValue(result), extrasNumber: result };
};

const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Criado em', key: 'charged' },
  { label: 'Agendado para', key: 'scheduledTo' },
  { label: 'Entregue em', key: 'delivered' },
  { label: 'Status', key: 'status' },
  { label: 'Valor do pedido', key: 'value' },
  { label: 'Taxa (IUGU)', key: 'iugu' },
  { label: 'Comissão (AppJusto)', key: 'appjusto' },
  { label: 'Extras', key: 'extras' },
  { label: 'Valor líquido', key: 'netValue' },
  { label: 'Método de pagamento', key: 'paymentMethod' },
  { label: 'Data de recebimento', key: 'paymentDate' },
  { label: 'Nome do cliente', key: 'consumerName' },
  { label: 'Tel. do cliente', key: 'consumerPhone' },
  { label: 'E-mail do cliente', key: 'consumerEmail' },
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
    const { iugu, iuguNumber } = getOrderIuguValue(order.fare);
    const { appjusto, appjustoNumber } = getOrderAppJustoComission(order.fare);
    const { extras, extrasNumber } = getOrderExtrasValue(order.fare?.business);
    const netValue = getOrderNetValue(
      order.fare,
      iuguNumber,
      appjustoNumber,
      extrasNumber
    );
    const paymentMethod = order.paymentMethod ?? 'Não encontrado';
    const paymentDate = getPaymentDate(order);
    const consumerName = order.consumer.name;
    const consumerPhone = order.consumer.phone ?? 'Não informado';
    const consumerEmail = order.consumer.email ?? 'Não informado';
    return {
      id: order.code,
      charged,
      scheduledTo,
      delivered,
      status,
      value,
      iugu,
      appjusto,
      extras,
      netValue,
      paymentMethod,
      paymentDate,
      consumerName,
      consumerPhone,
      consumerEmail,
    };
  });
  return { headers, data };
};
