import {
  CancelOrderPayload,
  ChatMessage,
  DropOrderPayload,
  OutsourceAccountType,
  Invoice,
  Issue,
  MatchOrderPayload,
  Order,
  OrderCancellation,
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
import { customCollectionSnapshot, customDocumentSnapshot, queryLimit } from '../utils';

export type CancellationData = {
  issue: WithId<Issue>;
  canceledById: string;
  comment?: string;
};

export type Ordering = 'asc' | 'desc';

export type Unsubscribe = firebase.Unsubscribe;
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
      .orderBy('timestamps.charged', ordering)
      .where('status', 'in', statuses);

    if (businessId) {
      query = query.where('business.id', '==', businessId);
    }
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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
  ): firebase.Unsubscribe {
    let query = this.refs.getOrdersRef().orderBy('updatedOn', 'desc').limit(queryLimit);
    if (orderStatus) query = query.where('status', '==', orderStatus);
    else query = query.where('status', 'in', statuses);
    if (startAfter) query = query.startAfter(startAfter);
    if (businessId) query = query.where('business.id', '==', businessId);
    if (orderCode) query = query.where('code', '==', orderCode);
    if (start && end) query = query.where('updatedOn', '>=', start).where('updatedOn', '<=', end);
    if (orderType) query = query.where('type', '==', orderType);
    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const last =
            snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;
          resultHandler(documentsAs<Order>(snapshot.docs), last);
        }
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
    orderCode?: string | null,
    start?: Date | null,
    end?: Date | null,
    orderStatus?: OrderStatus,
    startAfter?: FirebaseDocument
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .orderBy('updatedOn', 'desc')
      .limit(queryLimit)
      .where('business.id', '==', businessId)
      .where('status', 'in', statuses);
    if (startAfter) query = query.startAfter(startAfter);
    if (orderCode) query = query.where('code', '==', orderCode);
    if (start && end) query = query.where('updatedOn', '>=', start).where('updatedOn', '<=', end);
    if (orderStatus) query = query.where('status', '==', orderStatus);
    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const last =
            snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;
          resultHandler(documentsAs<Order>(snapshot.docs), last);
        }
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
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeOrder(
    orderId: string,
    resultHandler: (order: WithId<Order>) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderRef(orderId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Order>(query, (result) => {
      if (result) resultHandler(result);
    });
  }

  observeOrderByOrderCode(orderCode: string, resultHandler: (order: WithId<Order>) => void) {
    return this.refs
      .getOrdersRef()
      .where('code', '==', orderCode)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) resultHandler(documentAs<Order>(snapshot.docs[0]));
      });
  }

  observeOrderLogs(
    orderId: string,
    resultHandler: (order: WithId<OrderLog>[]) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderLogsRef(orderId).orderBy('timestamp', 'asc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeOrderChat(
    orderId: string,
    partId: string,
    counterpartId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getOrderChatRef(orderId)
      .where('from.id', '==', partId)
      .where('to.id', '==', counterpartId)
      .orderBy('timestamp', 'asc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeOrderIssues(
    orderId: string,
    resultHandler: (orderIssues: WithId<OrderIssue>[]) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getOrderIssuesRef(orderId).orderBy('createdOn', 'desc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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

  observeOrdersByCourierId(
    courierId: string,
    resultHandler: (orders: WithId<Order>[]) => void,
    start: Date,
    end: Date
  ): firebase.Unsubscribe {
    let query = this.refs
      .getOrdersRef()
      .orderBy('timestamps.confirmed', 'desc')
      .where('courier.id', '==', courierId)
      .where('timestamps.confirmed', '>=', start)
      .where('timestamps.confirmed', '<=', end);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
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
    let query = this.refs.getInvoicesRef().orderBy('createdOn', 'desc').limit(queryLimit);
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
    resultHandler: (invoices: WithId<Invoice>[]) => void
  ): firebase.Unsubscribe {
    let query = this.refs
      .getInvoicesRef()
      .orderBy('createdOn', 'desc')
      .where('accountId', '==', businessId)
      .where('status', '==', status)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeInvoice(
    invoiceId: string,
    resultHandler: (invoice: WithId<Invoice>) => void
  ): firebase.Unsubscribe {
    let query = this.refs.getInvoicesRef().doc(invoiceId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Invoice>(query, (result) => {
      if (result) resultHandler(result);
    });
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

  async createFakeOrder(order: Order) {
    return this.refs.getOrdersRef().add(order);
  }

  async updateOrder(orderId: string, changes: Partial<Order>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const orderChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    // CHECK IT
    //if (changes.status === 'confirmed') orderChanges.confirmedOn = timestamp;
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

  async getOutsourceDelivery(orderId: string, accountType?: OutsourceAccountType) {
    const payload: OutsourceDeliveryPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
    };
    if (accountType) payload.accountType = accountType;
    return await this.refs.getOutsourceDeliveryCallable()(payload);
  }
}
