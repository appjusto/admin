import { Coupon, Fare, Order, WithId } from '@appjusto/types';
import { initialBalance } from 'app/api/order/useFetchBusinessOrdersByMonth';
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

export const getOrderProductsValue = (fare?: Fare, coupon?: Coupon | null) => {
  if (!isOrdersCount(fare)) return 0;
  let result = fare?.business?.paid ?? 0;
  if (
    coupon?.createdBy.flavor === 'business' &&
    coupon.type !== 'food-discount'
  ) {
    result -= fare?.discount ?? 0;
  }
  return result;
};
export const getOrderDeliveryValue = (fare?: Fare, coupon?: Coupon | null) => {
  if (!isOrdersCount(fare)) return 0;
  let value = 0;
  if (fare?.courier?.payee === 'business') {
    value = fare.courier.value ?? 0;
  }
  if (
    coupon?.createdBy.flavor === 'business' &&
    coupon.type !== 'food-discount'
  ) {
    value -= fare?.discount ?? 0;
  }
  return value;
};

export const getOrderIuguValue = (fare?: Fare) => {
  // if (!isOrdersCount(fare)) return 0;
  if (!fare?.business?.paid) return 0;
  let result = fare?.business?.processing?.value ?? 0;
  // if outsourced by business it should be added to courier`s value
  if (fare?.courier?.payee === 'business') {
    result += fare?.courier?.processing?.value ?? 0;
  }
  return result;
};

export const getOrderComission = (fare?: Fare) => {
  // if (!isOrdersCount(fare)) return 0;
  if (!fare?.business?.paid) return 0;
  const result =
    (fare?.business?.commission ?? 0) + (fare?.business?.insurance ?? 0);
  return result;
};

export const getOrderNetValue = (
  fare: Fare | undefined,
  iugu: number,
  comission: number,
  extras: number,
  coupon?: Coupon | null
) => {
  const products = getOrderProductsValue(fare);
  const delivery = getOrderDeliveryValue(fare, coupon);
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
  const { extras } = fare?.business;
  let result = 0;
  extras.forEach((extra) => {
    result += extra.value;
  });
  return result;
};

export const getPeriodBalance = (orders?: WithId<Order>[]) => {
  if (!orders) return initialBalance;
  const balance = orders.reduce((result, order) => {
    // products
    const productsAmount = getOrderProductsValue(order.fare, order.coupon);
    // delivery
    const deliveryAmount = getOrderDeliveryValue(order.fare);
    // iugu
    const iuguCosts = getOrderIuguValue(order.fare);
    // comission
    const comission = getOrderComission(order.fare);
    // extras
    const extras = getOrderExtrasValue(order.fare);
    // netValue
    const netValue = getOrderNetValue(
      order.fare,
      iuguCosts,
      comission,
      extras,
      order.coupon
    );
    // item counts
    const count = isOrdersCount(order.fare) ? 1 : 0;
    // result
    return {
      productsAmount: result.productsAmount + productsAmount,
      deliveryAmount: result.deliveryAmount + deliveryAmount,
      iuguCosts: result.iuguCosts + iuguCosts,
      comission: result.comission + comission,
      extras: result.extras + extras,
      netValue: result.netValue + netValue,
      ordersNumber: result.ordersNumber + count,
    };
  }, initialBalance);
  return balance;
};
