import { Fare, Order, WithId } from '@appjusto/types';
import { formatCurrency } from 'utils/formatters';

export const formatCents = (value: string) =>
  parseInt(value.replace(/\D+/g, ''));

export const formatIuguValueToDisplay = (value?: string | null) => {
  if (!value) return 'R$ 0,00';
  try {
    if (value.includes('R$')) return value;
    else return formatCurrency(formatCents(value));
  } catch (error) {
    console.error(error);
    return 'R$ 0,00';
  }
};

export const formatIuguDateToDisplay = (date: string) => {
  const dateArr = date.split('-');
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
};

export const isOrdersCount = (fare?: Fare) => {
  if (!fare) return false;
  return (
    (fare.business?.paid && fare.business?.paid > 0) ||
    (fare.business?.extras && fare.business?.extras.length > 0)
  );
};

export const getOrderProductsValue = (fare?: Fare) => {
  if (!isOrdersCount(fare)) return 0;
  return fare?.business?.paid ?? 0;
};
export const getOrderDeliveryValue = (fare?: Fare) => {
  if (!isOrdersCount(fare)) return 0;
  let value = 0;
  if (fare?.courier?.payee === 'business') {
    value = fare.courier.value ?? 0;
  }
  return value;
};
export const getOrderIuguValue = (fare?: Fare) => {
  if (!isOrdersCount(fare)) return 0;
  let result = fare?.business?.processing?.value ?? 0;
  // if outsourced by business it should be added to courier`s value
  if (fare?.courier?.payee === 'business') {
    result += fare?.courier?.processing?.value ?? 0;
  }
  return result;
};

export const getOrderComission = (fare?: Fare) => {
  if (!isOrdersCount(fare)) return 0;
  const result =
    (fare?.business?.commission ?? 0) + (fare?.business?.insurance ?? 0);
  return result;
};

export const getOrderNetValue = (
  fare: Fare | undefined,
  iugu: number,
  comission: number,
  extras: number
) => {
  const products = getOrderProductsValue(fare);
  const delivery = getOrderDeliveryValue(fare);
  // if (!isOrdersCount(fare)) return 0;
  let businessValue = products + delivery;
  // if order was paid
  if (businessValue > 0) {
    const descounts = iugu + comission;
    businessValue -= descounts;
  }
  businessValue += extras;
  return businessValue;
};

// order statuses = ['delivered', 'scheduled', 'canceled']

export const getOrderExtrasValue = (fare?: Fare) => {
  if (!isOrdersCount(fare)) return 0;
  if (!fare?.business?.extras) return 0;
  const { extras: businessExtras } = fare?.business;
  return businessExtras.reduce((total, extra) => {
    return (total += extra.value);
  }, 0);
};

const initialBalance = {
  products: 0,
  delivery: 0,
  iugu: 0,
  comission: 0,
  extras: 0,
  netValue: 0,
  ordersNumber: 0,
};

const getOrdersBalance = (orders: WithId<Order>[]) => {
  return orders.reduce((result, order) => {
    // products
    const products = getOrderProductsValue(order.fare);
    // delivery
    const delivery = getOrderDeliveryValue(order.fare);
    // iugu
    const iugu = getOrderIuguValue(order.fare);
    // comission
    const comission = getOrderComission(order.fare);
    // extras
    const extras = getOrderExtrasValue(order.fare);
    // netValue
    const netValue = getOrderNetValue(order.fare, iugu, comission, extras);
    // item counts
    const count = isOrdersCount(order.fare) ? 1 : 0;
    // result
    return {
      products: (result.products += products),
      delivery: (result.delivery += delivery),
      iugu: (result.iugu += iugu),
      comission: (result.comission += comission),
      extras: (result.extras += extras),
      netValue: (result.netValue += netValue),
      ordersNumber: (result.ordersNumber += count),
    };
  }, initialBalance);
};

export const getPeriodBalance = (orders?: WithId<Order>[]) => {
  if (!orders) return initialBalance;
  console.log('getPeriodBalance n: ', orders.length);
  const {
    products,
    delivery,
    iugu,
    comission,
    extras,
    netValue,
    ordersNumber,
  } = getOrdersBalance(orders);
  return {
    products,
    delivery,
    iugu,
    comission,
    extras,
    netValue,
    ordersNumber,
  };
};
