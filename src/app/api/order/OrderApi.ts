import {
  CancelOrderPayload,
  ChatMessage,
  DropOrderPayload,
  Invoice,
  Issue,
  MatchOrderPayload,
  Order,
  OrderCancellation,
  //OrderCancellation,
  OrderChange,
  OrderFraudPreventionFlags,
  OrderIssue,
  OrderMatching,
  OrderStatus,
  OrderType,
  OutsourceDeliveryPayload,
  WithId,
} from 'appjusto-types';
import { documentAs, documentsAs, FirebaseDocument } from 'core/fb';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';
import * as Sentry from '@sentry/react';
import { IuguInvoiceStatus } from 'appjusto-types/payment/iugu';

export type CancellationData = {
  issue: WithId<Issue>;
  canceledById: string;
  comment?: string;
};

export type Ordering = 'asc' | 'desc';

export interface OrderLog {
  before: Partial<Order>;
  after: Partial<Order>;
  timestamp: firebase.firestore.FieldValue;
}

export default class OrderApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeOrders(
    statuses: OrderStatus[],
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: Ordering = 'desc'
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .orderBy('timestamps.confirming', ordering)
      .where('status', 'in', statuses);

    if (businessId) {
      query = query.where('business.id', '==', businessId);
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

  observeBusinessOrdersCompletedInTheLastHour(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: Ordering = 'desc'
  ): firebase.Unsubscribe {
    const statuses = ['delivered', 'canceled'] as OrderStatus[];
    const baseTim = new Date();
    baseTim.setHours(baseTim.getHours() - 1);
    let query = this.refs
      .getOrdersRef()
      .orderBy('updatedOn', ordering)
      .where('business.id', '==', businessId)
      .where('status', 'in', statuses)
      .where('updatedOn', '>', baseTim);

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

  observeDashboardOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string | null,
    start?: Date | null,
    end?: Date | null,
    orderStatus?: OrderStatus
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .orderBy('updatedOn', 'desc')
      .where('business.id', '==', businessId)
      .where('status', '==', orderStatus)
      .where('updatedOn', '>=', start)
      .where('updatedOn', '<=', end);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<Order>(querySnapshot.docs));
        else resultHandler(documentsAs<Order>([]));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeBODashboardOrders(
    statuses: OrderStatus[],
    resultHandler: (orders: WithId<Order>[]) => void,
    start?: Date | null
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .where('updatedOn', '>', start)
      .where('status', 'in', statuses);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<Order>(querySnapshot.docs));
        else resultHandler(documentsAs<Order>([]));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeOrdersHistory(
    resultHandler: (
      orders: WithId<Order>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    businessId: string | null | undefined,
    statuses: OrderStatus[] | null,
    orderCode: string | null | undefined,
    start: Date | null | undefined,
    end: Date | null | undefined,
    orderStatus: OrderStatus | undefined,
    orderType: OrderType | null,
    startAfter: FirebaseDocument | undefined
    //ignoreCache: boolean | undefined = false
  ): firebase.Unsubscribe {
    let query = this.refs.getOrdersRef().orderBy('timestamps.confirming', 'desc').limit(20);
    if (orderStatus) query = query.where('status', '==', orderStatus);
    else query = query.where('status', 'in', statuses);
    if (startAfter) query = query.startAfter(startAfter);
    if (businessId) query = query.where('business.id', '==', businessId);
    if (orderCode) query = query.where('code', '==', orderCode);
    if (start && end)
      query = query
        .where('timestamps.confirming', '>=', start)
        .where('timestamps.confirming', '<=', end);
    if (orderType) query = query.where('type', '==', orderType);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        //if (ignoreCache) {
        //  if (!querySnapshot.metadata.fromCache)
        //    resultHandler(documentsAs<Order>(querySnapshot.docs), last);
        //} else resultHandler(documentsAs<Order>(querySnapshot.docs), last);
        resultHandler(documentsAs<Order>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeBusinessOrdersHistory(
    resultHandler: (
      orders: WithId<Order>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    businessId: string | undefined,
    statuses: OrderStatus[] | null,
    orderCode: string | null | undefined,
    start: Date | null | undefined,
    end: Date | null | undefined,
    startAfter: FirebaseDocument | undefined
    //ignoreCache: boolean | undefined = false
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .orderBy('timestamps.confirming', 'desc')
      .limit(20)
      .where('business.id', '==', businessId)
      .where('status', 'in', statuses);
    if (startAfter) query = query.startAfter(startAfter);
    if (orderCode) query = query.where('code', '==', orderCode);
    if (start && end)
      query = query
        .where('timestamps.confirming', '>=', start)
        .where('timestamps.confirming', '<=', end);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<Order>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeBusinessCanceledOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId: string
  ): firebase.Unsubscribe {
    const timeLimit = new Date().getTime() - 86400000;
    const start_time = firebase.firestore.Timestamp.fromDate(new Date(timeLimit));

    let query = this.refs
      .getOrdersRef()
      .orderBy('updatedOn', 'desc')
      .where('updatedOn', '>=', start_time)
      .where('business.id', '==', businessId)
      .where('status', '==', 'canceled');

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

  observeOrder(
    orderId: string,
    resultHandler: (order: WithId<Order>) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderRef(orderId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Order>(querySnapshot));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeOrderLogs(
    orderId: string,
    resultHandler: (order: WithId<OrderLog>[] | null) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderLogsRef(orderId).orderBy('timestamp', 'asc');
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<OrderLog>(querySnapshot.docs));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeOrderChat(
    orderId: string,
    partId: string,
    counterpartId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getOrderChatRef(orderId)
      .where('from.id', '==', partId)
      .where('to.id', '==', counterpartId)
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

  observeOrderIssues(
    orderId: string,
    resultHandler: (orderIssues: WithId<OrderIssue>[]) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderIssuesRef(orderId).orderBy('createdOn', 'desc');
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<OrderIssue>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeOrderFraudPrevention(
    orderId: string,
    resultHandler: (flags: OrderFraudPreventionFlags | null) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderFraudPreventionRef(orderId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (querySnapshot.exists) resultHandler(querySnapshot.data() as OrderFraudPreventionFlags);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async getOrderStatusTimestamp(
    orderId: string,
    status: OrderStatus,
    resultHandler: (timestamp: firebase.firestore.Timestamp | null) => void
  ) {
    const query = this.refs
      .getOrderLogsRef(orderId)
      .where('after.status', '==', status)
      .orderBy('timestamp', 'desc')
      .limit(1);
    const result = await query.get();
    const log = documentsAs<OrderChange>(result.docs).find(() => true);
    return resultHandler((log?.timestamp as firebase.firestore.Timestamp) ?? null);
  }

  observeOrderPrivateMatching(
    orderId: string,
    resultHandler: (matching: OrderMatching | null) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderMatchingRef(orderId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (querySnapshot.exists) resultHandler(querySnapshot.data() as OrderMatching);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async getOrderPrivateCancellation(orderId: string) {
    const data = await this.refs.getOrderCancellationRef(orderId).get();
    if (!data.exists) return null;
    return documentAs<OrderCancellation>(data);
  }

  async updateOrderCourierNotified(orderId: string, couriersNotified: string[]) {
    return this.refs.getOrderMatchingRef(orderId).update({ couriersNotified });
  }

  async getOrderIssues(orderId: string) {
    return documentsAs<OrderIssue>(
      (await this.refs.getOrderIssuesRef(orderId).orderBy('createdOn', 'desc').get()).docs
    );
  }

  async fetchOrderById(orderId: string) {
    const data = await this.refs.getOrderRef(orderId).get();
    return data ? { ...data.data(), id: orderId } : null;
  }

  async fetchOrdersByConsumerId(consumerId: string) {
    return documentsAs<Order>(
      (
        await this.refs
          .getOrdersRef()
          .orderBy('createdOn', 'desc')
          .where('consumer.id', '==', consumerId)
          .get()
      ).docs
    );
  }

  observeOrdersByCourierId(
    courierId: string,
    resultHandler: (orders: WithId<Order>[]) => void,
    start: Date,
    end: Date
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .orderBy('confirmedOn', 'desc')
      .where('courier.id', '==', courierId)
      .where('confirmedOn', '>=', start)
      .where('confirmedOn', '<=', end);

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

  observeOrderInvoices(
    orderId: string,
    resultHandler: (invoices: WithId<Invoice>[]) => void,
    businessId?: string
  ): firebase.Unsubscribe {
    let query = this.refs
      .getInvoicesRef()
      .orderBy('createdOn', 'asc')
      .where('orderId', '==', orderId);
    if (businessId) query = query.where('accountId', '==', businessId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<Invoice>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeInvoices(
    resultHandler: (
      invoices: WithId<Invoice>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    orderCode?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfter?: FirebaseDocument,
    status?: IuguInvoiceStatus
  ): firebase.Unsubscribe {
    let query = this.refs.getInvoicesRef().orderBy('createdOn', 'desc').limit(20);
    if (status) query = query.where('status', '==', status);
    if (startAfter) query = query.startAfter(startAfter);
    if (orderCode) query = query.where('orderCode', '==', orderCode);
    if (start && end) query = query.where('createdOn', '>=', start).where('createdOn', '<=', end);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<Invoice>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeInvoicesStatusByPeriod(
    businessId: string,
    start: Date,
    end: Date,
    status: IuguInvoiceStatus,
    resultHandler: (invoices: WithId<Invoice>[] | null) => void
  ): firebase.Unsubscribe {
    let query = this.refs
      .getInvoicesRef()
      .orderBy('createdOn', 'desc')
      .where('accountId', '==', businessId)
      .where('status', '==', status)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<Invoice>(querySnapshot.docs));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeInvoice(
    invoiceId: string,
    resultHandler: (invoice: WithId<Invoice>) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getInvoicesRef().doc(invoiceId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const data = querySnapshot;
        if (data.exists) resultHandler(documentAs<Invoice>(data));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
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

  async createFakeOrder(order: Order) {
    return this.refs.getOrdersRef().add(order);
  }

  async updateOrder(orderId: string, changes: Partial<Order>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const orderChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    if (changes.status === 'confirmed') orderChanges.confirmedOn = timestamp;
    await this.refs.getOrderRef(orderId).update(orderChanges);
  }

  async cancelOrder(data: CancelOrderPayload) {
    const { params } = data;
    const paramsData = params ?? { refund: ['products', 'delivery', 'platform'] };
    // get callable function ref and send data to bakcend
    const payload: CancelOrderPayload = {
      ...data,
      meta: { version: '1' }, // TODO: pass correct version on
      params: paramsData,
    };
    return await this.refs.getCancelOrderCallable()(payload);
  }

  async courierManualAllocation(orderId: string, courierId: string, comment: string) {
    const payload: MatchOrderPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
      courierId,
      comment,
    };
    return await this.refs.getMatchOrderCallable()(payload);
  }

  async courierManualRemoval(
    orderId: string,
    //courierId: string,
    issue: WithId<Issue>,
    comment?: string
  ) {
    const payload: DropOrderPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
      //courierId,
      issue,
      comment,
    };
    return await this.refs.getDropOrderCallable()(payload);
  }

  async getOutsourceDelivery(orderId: string) {
    const payload: OutsourceDeliveryPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
    };
    return await this.refs.getOutsourceDeliveryCallable()(payload);
  }
}
