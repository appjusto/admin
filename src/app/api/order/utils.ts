import { Order, OrderCancellationParams, WithId } from '@appjusto/types';
import { omit } from 'lodash';
import { use } from 'utils/local';
import { Acknowledgement, OrderAcknowledgement } from './types';
import firebase from 'firebase/app';

const { setObject, getObject, removeObject } = use('kanban');

export const getAck = (key: string) => getObject<Acknowledgement>(key) ?? {};

export const setAck = (key: string, ack: Acknowledgement) => setObject<Acknowledgement>(key, ack);

export const removeAck = (key: string) => removeObject(key);

export const getAckOrderIds = (ack: Acknowledgement) => Object.keys(ack);

export const getAckOrders = (ack: Acknowledgement) =>
  getAckOrderIds(ack).map((orderId) => getOrderAck(ack, orderId));

export const getOrderAck = (ack: Acknowledgement, orderId: string) => ack[orderId];

export const addOrderAck = (ack: Acknowledgement, order: WithId<Order>) =>
  ({
    ...ack,
    [order.id]: {
      receivedAt: new Date().getTime(),
      notified: false,
      order: {
        id: order.id,
        code: order.code,
        consumer: {
          name: order.consumer.name,
        },
      },
    },
  } as Acknowledgement);

export const updateOrderAck = (ack: Acknowledgement, orderAck: OrderAcknowledgement) =>
  ({
    ...ack,
    [orderAck.order.id]: orderAck,
  } as Acknowledgement);

export const removeOrderAck = (ack: Acknowledgement, orderId: string) =>
  omit(ack, [orderId]) as Acknowledgement;

export const getOrderAckTime = (key: string, orderId: string) => {
  try {
    const ack = getAck(key);
    const orderAck = getOrderAck(ack, orderId);
    const time = orderAck.receivedAt;
    return time;
  } catch (error) {
    return null;
  }
};

export const calculateCancellationCosts = (order: Order, params: OrderCancellationParams) => {
  let costs = 0;
  if (order.fare?.business && params.refund.indexOf('products') !== -1)
    costs += order.fare.business.value;
  if (order.fare?.courier && params.refund.indexOf('delivery') !== -1)
    costs += order.fare.courier.value;
  if (order.fare?.platform && params.refund.indexOf('platform') !== -1)
    costs += order.fare.platform.value;
  return costs;
};

export const orderPeriodFilter = (
  timestamp: firebase.firestore.Timestamp,
  start: Date,
  end?: Date
) => {
  if (!timestamp) return false;
  let value = timestamp.seconds;
  let startLimit = start.getTime() / 1000;
  let endLimit = end ? end.getTime() / 1000 : null;
  if (endLimit) return value > startLimit && value < endLimit;
  else return value > startLimit;
};

export const findMostFrequentProduct = (products: string[]) => {
  if (products.length === 0) return 'N/E';
  let compare = '';
  let mostFreq = '';
  products.reduce((acc, val) => {
    if (val in acc) {
      //@ts-ignore
      acc[val]++;
    } else {
      //@ts-ignore
      acc[val] = 1;
    }
    //@ts-ignore
    if (acc[val] > compare) {
      //@ts-ignore
      compare = acc[val];
      mostFreq = val;
    }
    return acc;
  }, {});
  return mostFreq;
};

export interface OrdersByDay {
  date: number;
  value: number;
}

export const splitOrdersValuesByPeriod = (
  orders: WithId<Order>[],
  periodNumber: number,
  endDate: number,
  lastDayLastMonth: number
) => {
  let period = [] as OrdersByDay[];
  let currentMonthReducer = 0;
  let lastMonthReducer = 0;
  for (let i = 0; i < periodNumber; i++) {
    let date;
    if (endDate - currentMonthReducer > 0) {
      date = endDate - currentMonthReducer;
      currentMonthReducer += 1;
    } else {
      date = lastDayLastMonth - lastMonthReducer;
      lastMonthReducer += 1;
    }
    period.push({ date, value: 0 });
  }
  orders.forEach((order) => {
    const date = (order.updatedOn as firebase.firestore.Timestamp).toDate().getDate();
    let item = period.find((item) => item.date === date);
    if (item) item.value += 1;
  });
  return period.reverse();
};
