import { ChatMessage, FoodOrderStatus, Issue, Order, OrderIssue, WithId } from 'appjusto-types';
import { documentsAs } from 'core/fb';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';

export const ActiveFoodOrdersValues: FoodOrderStatus[] = [
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'canceled',
];
export const InactiveFoodOrdersValues: FoodOrderStatus[] = ['quote', 'confirming', 'delivered'];
export const FoodOrdersValues = [...ActiveFoodOrdersValues, ...InactiveFoodOrdersValues];

export type ObserveOrdersOptions = {
  active?: boolean;
  inactive?: boolean;
};

export default class OrderApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string
  ): firebase.Unsubscribe {
    const statuses = [
      ...(options.active ? ActiveFoodOrdersValues : []),
      ...(options.inactive ? InactiveFoodOrdersValues : []),
    ];
    const timeLimit = new Date().getTime() - 86400000;
    const start_time = firebase.firestore.Timestamp.fromDate(new Date(timeLimit));

    let query = this.refs
      .getOrdersRef()
      .orderBy('createdOn', 'desc')
      .where('createdOn', '>=', start_time)
      .where('status', 'in', statuses);

    if (businessId) {
      query = this.refs
        .getOrdersRef()
        .orderBy('createdOn', 'desc')
        .where('createdOn', '>=', start_time)
        .where('business.id', '==', businessId)
        .where('status', 'in', statuses);
    }
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<Order>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // observe order's chat
  observeOrderChat(
    orderId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getOrderChatRef(orderId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          resultHandler(documentsAs<ChatMessage>(querySnapshot.docs));
        },
        (error) => {
          console.error(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async fetchOrderById(orderId: string) {
    const data = await this.refs.getOrderRef(orderId).get();
    return data ? { ...data.data(), id: orderId } : null;
  }

  async fetchOrdersByConsumerId(consumerId: string) {
    return documentsAs<Order>(
      (await this.refs.getOrdersRef().where('consumer.id', '==', consumerId).get()).docs
    );
  }

  async sendMessage(orderId: string, message: Partial<ChatMessage>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.refs.getOrderChatRef(orderId).add({
      ...message,
      timestamp,
    });
  }

  async createFakeOrder(order: Order) {
    return this.refs.getOrdersRef().add(order);
  }

  async updateOrder(orderId: string, changes: Partial<Order>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getOrderRef(orderId).update({
      ...changes,
      updatedOn: timestamp,
    });
  }

  async cancelOrder(orderId: string, issue: WithId<Issue>, comment?: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getOrderRef(orderId).update({
      status: 'canceled',
      updatedOn: timestamp,
    });
    await this.refs.getOrderIssuesRef(orderId).add({ createdOn: timestamp, issue, comment });
  }

  async getOrderIssues(orderId: string) {
    return documentsAs<OrderIssue>(
      (await this.refs.getOrderIssuesRef(orderId).orderBy('createdOn', 'desc').get()).docs
    );
  }
}
