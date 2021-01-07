import { ChatMessage, FoodOrderStatus, Issue, IssueType, Order, WithId } from 'appjusto-types';
import { documentsAs } from 'core/fb';
import firebase from 'firebase';
import FirestoreRefs from '../FirestoreRefs';

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
  constructor(private refs: FirestoreRefs) {}

  // firestore
  observeOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ): firebase.Unsubscribe {
    const statuses = [
      ...(options.active ? ActiveFoodOrdersValues : []),
      ...(options.inactive ? InactiveFoodOrdersValues : []),
    ];
    let query = this.refs
      .getOrdersRef()
      .orderBy('createdOn', 'desc')
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
}
