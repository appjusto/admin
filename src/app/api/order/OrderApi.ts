import { ChatMessage, FoodOrderStatus, Issue, IssueType, Order, WithId } from 'appjusto-types';
import { documentsAs } from 'core/fb';
import firebase from 'firebase';
import FirebaseRefs from '../FirebaseRefs';

export const ActiveFoodOrdersValues: FoodOrderStatus[] = [
  'confirming',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
];
export const InactiveFoodOrdersValues: FoodOrderStatus[] = ['quote', 'delivered', 'canceled'];
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
    businessId: string,
    resultHandler: (orders: WithId<Order>[]) => void
  ): firebase.Unsubscribe {
    const statuses = [
      ...(options.active ? ActiveFoodOrdersValues : []),
      ...(options.inactive ? InactiveFoodOrdersValues : []),
    ];
    let query = this.refs
      .getOrdersRef()
      .orderBy('createdOn', 'desc')
      .where('business.id', '==', businessId)
      .where('status', 'in', statuses);

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

  async sendMessage(orderId: string, message: Partial<ChatMessage>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.refs.getOrderChatRef(orderId).add({
      ...message,
      timestamp,
    });
  }

  async fetchIssues(type: IssueType) {
    return documentsAs<Issue>(
      (await this.refs.getIssuesRef().where('type', '==', type).get()).docs
    );
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

  async setOrderIssue(orderId: string, issue: WithId<Issue>) {
    const createdOn = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getOrderIssuesRef(orderId).add({ createdOn, issue });
  }
}
