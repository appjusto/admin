import { Invoice, Order, OrderCancellationParams, WithId } from '@appjusto/types';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { omit } from 'lodash';
import { getTimeUntilNow } from 'utils/functions';
import { use } from 'utils/local';
import { Acknowledgement, OrderAcknowledgement } from './types';

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

export const objectPeriodFilter = (timestamp: Timestamp, start: Date, end?: Date) => {
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

export interface ItemByDay {
  date: number;
  value: number;
}

export const splitInvoicesValuesByPeriod = (
  invoices: WithId<Invoice>[],
  periodNumber: number,
  startDate: number // milliseconds
) => {
  let period = [] as ItemByDay[];
  for (let i = 0; i < periodNumber; i++) {
    const time = i * 1000 * 60 * 60 * 24;
    const date = dayjs(startDate + time).date();
    period.push({ date, value: 0 });
  }
  invoices.forEach((invoice) => {
    const date = (invoice.updatedOn as Timestamp).toDate().getDate();
    let item = period.find((item) => item.date === date);
    if (item) item.value += 1;
  });
  return period.map((item) => item.value);
};

export const getOrderWarning = (
  order: WithId<Order>, 
  now: number,
  confirmed: number, 
  matching: number, 
  goingPickup: number, 
  readyArrivedPickup: number, 
  dispatchingArrivedPickup: number, 
  goingDestination: number, 
  ) => {
  console.log("getOrderWarning Call: ", new Date())
  try {
    let warning = null;
    if(
      order.type === 'food' && 
      order.status === 'confirmed' &&
      order.timestamps.confirmed
      ) {
        const baseTime = (order.timestamps.confirmed as Timestamp).toMillis();
        const elapsedTime = getTimeUntilNow(now, baseTime);
        if(elapsedTime >= confirmed) {
          warning = 'DEMORA NO ACEITE';
        }
    } else if (
      order.dispatchingStatus === 'matching' &&
      order.dispatchingTimestamps.matching
      ) {
        const baseTime = (order.dispatchingTimestamps.matching as Timestamp).toMillis();
        const elapsedTime = getTimeUntilNow(now, baseTime);
        if(elapsedTime >= matching) {
          warning = 'DEMORA NO MATCHING';
        }
    } else if (
      order.dispatchingState === 'going-pickup' &&
      order.dispatchingTimestamps.goingPickup
      ) {
        const baseTime = (order.dispatchingTimestamps.goingPickup as Timestamp).toMillis();
        const elapsedTime = getTimeUntilNow(now, baseTime);
        if(elapsedTime >= goingPickup) {
          warning = 'DEMORA A CAMINHO DA COLETA';
        }
    } else if (
      order.status === 'ready' &&
      order.dispatchingState === 'arrived-pickup' && 
      order.dispatchingTimestamps.arrivedPickup
      ) {
        const baseTime = (order.dispatchingTimestamps.arrivedPickup as Timestamp).toMillis();
        const elapsedTime = getTimeUntilNow(now, baseTime);
        if(elapsedTime >= readyArrivedPickup) {
          warning = 'DEMORA PARA RECEBER O PEDIDO';
        }
    } else if (
      order.status === 'dispatching' &&
      order.timestamps.dispatching &&
      order.dispatchingState === 'arrived-pickup'
    ) {
        const baseTime = (order.timestamps.dispatching as Timestamp).toMillis();
        const elapsedTime = getTimeUntilNow(now, baseTime);
        if(elapsedTime >= dispatchingArrivedPickup) {
          warning = 'DEMORA NA SAIDA PARA ENTREGA';
        }
    } else if (
      order.dispatchingState === 'going-destination' && 
      order.dispatchingTimestamps.goingDestination
      ) {
        const baseTime = (order.dispatchingTimestamps.goingDestination as Timestamp).toMillis();
        const elapsedTime = getTimeUntilNow(now, baseTime);
        if(elapsedTime >= goingDestination) {
          warning = 'DEMORA A CAMINHO DA ENTREGA';
        }
    }
    return warning;
  } catch (error) {
    console.error("getOrderWarning error: ", error);
    return null;
  }
}
