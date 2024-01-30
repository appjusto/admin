import {
  CancelOrderPayload,
  CourierOrderRequest,
  DropOrderPayload,
  Fulfillment,
  Incident,
  Issue,
  MatchOrderPayload,
  Order,
  OrderCancellation,
  OrderCancellationParams,
  OrderConfirmation,
  OrderFraudPreventionFlags,
  OrderIssue,
  OrderLog,
  OrderMatching,
  OrderMatchingLog,
  OrderPayload,
  OrderStatus,
  OrderType,
  OutsourceAccountType,
  OutsourceDeliveryPayload,
  ProfileNote,
  UpdateOrderPayload,
  WithId,
} from '@appjusto/types';
import {
  LalamoveOrder,
  LalamoveQuotation,
} from '@appjusto/types/external/lalamove/index';
import * as Sentry from '@sentry/react';
import { documentAs, documentsAs, FirebaseDocument } from 'core/fb';
import dayjs from 'dayjs';
import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { InQueryArray } from '../types';
import {
  customCollectionSnapshot,
  customDocumentSnapshot,
  queryLimit,
} from '../utils';

export type Ordering = 'asc' | 'desc';

export type OrderLogType =
  | 'change'
  | 'payment'
  | 'info'
  | 'matching'
  | 'courier-location';

export default class OrderApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  observeOrders(
    statuses: OrderStatus[],
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: Ordering = 'desc',
    queryLimit?: number
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.confirming', ordering),
      where('status', 'in', statuses)
    );
    if (queryLimit) q = query(q, limit(queryLimit));
    if (businessId) {
      q = query(q, where('business.id', '==', businessId));
    }
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeStaffOrders(
    statuses: OrderStatus[],
    resultHandler: (orders: WithId<Order>[]) => void,
    staffId: string,
    ordering: Ordering = 'desc'
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.confirming', ordering),
      where('status', 'in', statuses),
      where('staff.id', '==', staffId)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeBOActiveOrders(
    statuses: OrderStatus[],
    resultHandler: (
      orders: WithId<Order>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    queryLimit: number = 10,
    isNoStaff: boolean = true,
    ordering: Ordering = 'asc'
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.confirming', ordering),
      where('status', 'in', statuses),
      limit(queryLimit)
    );
    if (isNoStaff) q = query(q, where('staff', '==', null));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeFlaggedOrders(
    flags: string[],
    status: OrderStatus | undefined,
    resultHandler: (
      orders: WithId<Order>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    queryLimit: number = 10,
    isNoStaff: boolean = true,
    ordering: Ordering = 'asc'
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.confirming', ordering),
      where('flags', 'array-contains-any', flags),
      limit(queryLimit)
    );
    if (status) q = query(q, where('status', '==', status));
    if (isNoStaff) q = query(q, where('staff', '==', null));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeCanceledOrdersInTheLastHour(
    resultHandler: (orders: WithId<Order>[]) => void,
    queryLimit: number,
    businessId?: string,
    ordering: Ordering = 'asc'
  ): Unsubscribe {
    const baseTime = dayjs().subtract(1, 'hour').toDate();
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.canceled', ordering),
      where('business.id', '==', businessId),
      where('status', '==', 'canceled'),
      where('timestamps.canceled', '>=', baseTime),
      limit(queryLimit)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeScheduledOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    queryLimit: number,
    businessId?: string,
    ordering: Ordering = 'asc'
  ): Unsubscribe {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('confirmedScheduledTo', ordering),
      where('business.id', '==', businessId),
      where('status', '==', 'scheduled'),
      where('confirmedScheduledTo', '>=', start),
      where('confirmedScheduledTo', '<=', end),
      limit(queryLimit)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeScheduledOrdersTotal(
    resultHandler: (total: number) => void,
    businessId?: string
  ): Unsubscribe {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();
    let q = query(
      this.refs.getOrdersRef(),
      where('business.id', '==', businessId),
      where('status', '==', 'scheduled'),
      where('scheduledTo', '>=', start),
      where('scheduledTo', '<=', end)
    );
    // returns the unsubscribe function
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) resultHandler(0);
        else resultHandler(snapshot.size);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeDashboardOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId: string,
    start: Date,
    end: Date,
    statuses: OrderStatus[]
  ): Unsubscribe {
    const q = query(
      this.refs.getOrdersRef(),
      orderBy('updatedOn', 'desc'),
      where('business.id', '==', businessId),
      where('status', 'in', statuses),
      where('updatedOn', '>=', start),
      where('updatedOn', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeBODashboardOrders(
    statuses: OrderStatus[],
    resultHandler: (orders: WithId<Order>[]) => void,
    start?: Date | null
  ): Unsubscribe {
    const q = query(
      this.refs.getOrdersRef(),
      where('updatedOn', '>', start),
      where('status', 'in', statuses)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrdersHistory(
    resultHandler: (
      orders: WithId<Order>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    businessId: string | null | undefined,
    statuses: InQueryArray<OrderStatus> | null,
    orderCode: string | null | undefined,
    start: Date | null | undefined,
    end: Date | null | undefined,
    orderStatus: OrderStatus | undefined,
    orderType: OrderType | null,
    fulfillment?: Fulfillment[],
    startAfterDoc?: FirebaseDocument
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('updatedOn', 'desc'),
      limit(queryLimit)
    );
    if (orderStatus) q = query(q, where('status', '==', orderStatus));
    else q = query(q, where('status', 'in', statuses));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (businessId) q = query(q, where('business.id', '==', businessId));
    if (orderCode) q = query(q, where('code', '==', orderCode));
    if (start && end)
      q = query(
        q,
        where('updatedOn', '>=', start),
        where('updatedOn', '<=', end)
      );
    if (orderType) q = query(q, where('type', '==', orderType));
    // fulfillment
    if (orderType !== 'p2p' && fulfillment && fulfillment.length === 1)
      q = query(q, where('fulfillment', '==', fulfillment[0]));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const last =
            snapshot.docs.length > 0
              ? snapshot.docs[snapshot.docs.length - 1]
              : undefined;
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
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    businessId: string | undefined,
    statuses: OrderStatus[] | null,
    orderCode?: string | null,
    start?: Date | null,
    end?: Date | null,
    orderStatus?: OrderStatus,
    fulfillment?: Fulfillment[],
    startAfterDoc?: FirebaseDocument
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      // orderBy('updatedOn', 'desc'),
      limit(queryLimit),
      where('business.id', '==', businessId),
      where('status', 'in', statuses)
    );
    if (orderCode) q = query(q, where('code', '==', orderCode));
    else {
      // orderBy
      if (orderStatus !== 'scheduled')
        q = query(q, orderBy('timestamps.confirming', 'desc'));
      else q = query(q, orderBy('scheduledTo', 'desc'));
      // filters
      if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
      // dates
      if (orderStatus !== 'scheduled' && start && end)
        q = query(
          q,
          where('timestamps.confirming', '>=', start),
          where('timestamps.confirming', '<=', end)
        );
      if (orderStatus === 'scheduled' && start && end)
        q = query(
          q,
          where('scheduledTo', '>=', start),
          where('scheduledTo', '<=', end)
        );
      // status
      if (orderStatus) q = query(q, where('status', '==', orderStatus));
      // fulfillment
      if (fulfillment && fulfillment.length === 1)
        q = query(q, where('fulfillment', '==', fulfillment[0]));
    }
    // Unsubscribe
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const last =
            snapshot.docs.length > 0
              ? snapshot.docs[snapshot.docs.length - 1]
              : undefined;
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
  async fetchBusinessOrdersByPeriod(
    businessId: string,
    statuses: OrderStatus[],
    start: Date,
    end: Date
  ): Promise<WithId<Order>[]> {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.confirming', 'asc'),
      where('business.id', '==', businessId),
      where('status', 'in', statuses),
      where('timestamps.confirming', '>=', start),
      where('timestamps.confirming', '<=', end)
    );
    // Unsubscribe
    const data = await getDocs(q);
    const orders = documentsAs<Order>(data.docs);
    return orders;
  }

  observeBusinessCanceledOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId: string
  ): Unsubscribe {
    const timeLimit = new Date().getTime() - 86400000;
    const start_time = Timestamp.fromDate(new Date(timeLimit));
    const q = query(
      this.refs.getOrdersRef(),
      orderBy('updatedOn', 'desc'),
      where('updatedOn', '>=', start_time),
      where('business.id', '==', businessId),
      where('status', '==', 'canceled')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  getBusinessDeliveredOrdersByStartDate(
    businessId: string,
    start: Date,
    resultHandler: (orders: WithId<Order>[]) => void
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.delivered'),
      where('business.id', '==', businessId),
      where('timestamps.delivered', '<=', start),
      limit(1)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrder(
    orderId: string,
    resultHandler: (order: WithId<Order>) => void
  ): Unsubscribe {
    const ref = this.refs.getOrderRef(orderId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Order>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }

  observeOrderByOrderCode(
    orderCode: string,
    resultHandler: (order: WithId<Order>) => void
  ) {
    const q = query(this.refs.getOrdersRef(), where('code', '==', orderCode));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) resultHandler(documentAs<Order>(snapshot.docs[0]));
    });
  }

  observeOrderDeprecatedLogs(
    orderId: string,
    timeLimit: Date,
    resultHandler: (order: WithId<OrderLog>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getOrderLogsRef(orderId),
      where('timestamp', '<=', timeLimit),
      orderBy('timestamp', 'asc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderLogs(
    orderId: string,
    type: OrderLogType,
    resultHandler: (logs: WithId<OrderLog>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getOrderLogsRef(orderId),
      where('type', '==', type),
      orderBy('timestamp', 'asc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderMatchingLogs(
    orderId: string,
    resultHandler: (
      logs: WithId<OrderMatchingLog>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    startAfterDoc?: FirebaseDocument,
    queryLimit?: number
  ): Unsubscribe {
    let q = query(
      this.refs.getOrderLogsRef(orderId),
      where('type', '==', 'matching'),
      orderBy('timestamp', 'asc')
    );
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (queryLimit) q = query(q, limit(queryLimit));
    // returns the unsubscribe function
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[querySnapshot.size - 1]
            : undefined;
        resultHandler(documentsAs<OrderMatchingLog>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    return unsubscribe;
  }

  observeOrderNotifiedCouriers(
    orderId: string,
    resultHandler: (
      notifiedCouriers: WithId<CourierOrderRequest>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    startAfterDoc?: FirebaseDocument
  ): Unsubscribe {
    let q = query(
      this.refs.getCourierRequestsRef(),
      where('orderId', '==', orderId),
      orderBy('createdOn', 'asc'),
      limit(10)
    );
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    // returns the unsubscribe function
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[querySnapshot.size - 1]
            : undefined;
        resultHandler(
          documentsAs<CourierOrderRequest>(querySnapshot.docs),
          last
        );
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    return unsubscribe;
  }

  observeOrderIssues(
    orderId: string,
    resultHandler: (orderIssues: WithId<OrderIssue>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getOrderIssuesRef(orderId),
      orderBy('createdOn', 'desc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderIncidentes(
    orderId: string,
    resultHandler: (incidents: WithId<Incident>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getIncidentsRef(),
      where('orderId', '==', orderId),
      orderBy('createdAt', 'desc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderPrivateFraudPrevention(
    orderId: string,
    resultHandler: (flags: OrderFraudPreventionFlags | null) => void
  ): Unsubscribe {
    const ref = this.refs.getOrderFraudPreventionRef(orderId);
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        if (querySnapshot.exists())
          resultHandler(querySnapshot.data() as OrderFraudPreventionFlags);
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
  ): Unsubscribe {
    const ref = this.refs.getOrderMatchingRef(orderId);
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        if (querySnapshot.exists())
          resultHandler(querySnapshot.data() as OrderMatching);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeOrderPrivateConfirmation(
    orderId: string,
    resultHandler: (matching: OrderConfirmation | null) => void
  ): Unsubscribe {
    const ref = this.refs.getOrderConfirmationRef(orderId);
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        if (querySnapshot.exists())
          resultHandler(querySnapshot.data() as OrderConfirmation);
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
    statuses?: OrderStatus[],
    start?: Date,
    end?: Date
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.confirmed', 'desc'),
      where('courier.id', '==', courierId)
    );
    if (statuses) {
      q = query(q, where('status', 'in', statuses));
    }
    if (start && end) {
      q = query(
        q,
        where('timestamps.confirmed', '>=', start),
        where('timestamps.confirmed', '<=', end)
      );
    }
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderLalamoveQuotations(
    orderId: string,
    resultHandler: (quotations: WithId<LalamoveQuotation>[]) => void
  ) {
    const cotationsRef = this.refs.getLalamoveQuotationsRef();
    const q = query(
      cotationsRef,
      where('orderId', '==', orderId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderLalamoveOrders(
    quotationId: string,
    resultHandler: (lalamoveOrder: WithId<LalamoveOrder>[]) => void
  ) {
    const lalamoveOrdersRef = this.refs.getLalamoveOrdersRef();
    const q = query(
      lalamoveOrdersRef,
      where('order.quotationId', '==', quotationId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    return customCollectionSnapshot(q, resultHandler);
  }

  async getOrderIdByCode(orderCode: string) {
    const q = query(this.refs.getOrdersRef(), where('code', '==', orderCode));
    const orderId = await getDocs(q).then((snapshot) => {
      if (!snapshot.empty) return snapshot.docs[0].id;
      else
        throw new FirebaseError(
          'ignored-error',
          'Não foi possível encontrar o pedido.'
        );
    });
    return orderId;
  }

  async getOrderPrivateCancellation(orderId: string) {
    const doc = await getDoc(this.refs.getOrderCancellationRef(orderId));
    if (!doc.exists) return null;
    return doc.data() as OrderCancellation;
  }

  async updateOrderCourierNotified(
    orderId: string,
    couriersNotified: string[]
  ) {
    return updateDoc(this.refs.getOrderMatchingRef(orderId), {
      couriersNotified,
    });
  }

  async getOrderIssues(orderId: string) {
    const q = query(
      this.refs.getOrderIssuesRef(orderId),
      orderBy('createdOn', 'desc')
    );
    const data = await getDocs(q);
    return documentsAs<OrderIssue>(data.docs);
  }

  async fetchOrderById(orderId: string) {
    const data = await getDoc(this.refs.getOrderRef(orderId));
    if (data.exists()) return documentAs<Order>(data);
    else return null;
  }

  async fetchOrderByCode(orderCode: string, businessId?: string) {
    let q = query(this.refs.getOrdersRef(), where('code', '==', orderCode));
    if (businessId) q = query(q, where('business.id', '==', businessId));
    const data = await getDocs(q);
    if (!data.empty) return documentsAs<Order>(data.docs);
    else return null;
  }

  async fetchOrdersByConsumerId(consumerId: string) {
    const q = query(
      this.refs.getOrdersRef(),
      orderBy('createdOn', 'desc'),
      where('consumer.id', '==', consumerId)
    );
    const data = await getDocs(q);
    return documentsAs<Order>(data.docs);
  }

  async fetchBusinessTotalOrdersByConsumer(
    businessId: string,
    consumerId: string,
    statuses: OrderStatus[]
  ) {
    const q = query(
      this.refs.getOrdersRef(),
      orderBy('createdOn', 'desc'),
      where('business.id', '==', businessId),
      where('consumer.id', '==', consumerId),
      where('status', 'in', statuses)
    );
    try {
      const data = await getDocs(q);
      return data.size;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  }

  async createFakeOrder(order: Order) {
    return addDoc(this.refs.getOrdersRef(), order);
  }

  async updateOrder(orderId: string, changes: Partial<Order>) {
    const timestamp = serverTimestamp();
    const orderChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    await updateDoc(this.refs.getOrderRef(orderId), orderChanges);
  }

  async cancelOrder(data: CancelOrderPayload) {
    const { params, cancellation } = data;
    const defaultParams: OrderCancellationParams =
      cancellation?.id === 'restaurant-cancel-missing-client'
        ? {
            refund: [],
          }
        : {
            refund: ['service', 'products', 'delivery', 'tip'],
          };
    const paramsData = params ?? defaultParams;
    const payload: CancelOrderPayload = {
      ...data,
      meta: { version: '1' }, // TODO: pass correct version on
      params: paramsData,
    };
    return await this.refs.getCancelOrderCallable()(payload);
  }

  async deleteQuoteOrder(orderId: string) {
    const orderRef = this.refs.getOrderRef(orderId);
    const orderSnapshot = await getDoc(orderRef);
    if (!orderSnapshot.exists()) {
      throw new FirebaseError(
        'ignored-error',
        'O pedido informado não existe.'
      );
    }
    const order = documentAs<Order>(orderSnapshot);
    if (order.status !== 'quote') {
      throw new FirebaseError(
        'ignored-error',
        'Operação negada. O status do pedido informado não é "cotação".'
      );
    }
    await deleteDoc(orderRef);
    return true;
  }

  async courierManualAllocation(
    orderId: string,
    courierId: string | undefined,
    courierCode: string | undefined,
    comment: string
  ) {
    const payload: MatchOrderPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
      courierId,
      courierCode,
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

  async getUpdateOrder(orderId: string, accountType: OutsourceAccountType) {
    const payload: UpdateOrderPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
      action: 'update-fare-courier-payee',
      payee: accountType,
    };
    return await this.refs.getUpdateOrderCallable()(payload);
  }

  async getOutsourceDelivery(
    orderId: string,
    accountType?: OutsourceAccountType,
    isAuto?: boolean,
    priorityFee?: string
  ) {
    const payload: OutsourceDeliveryPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
      isAuto,
      priorityFee,
    };
    if (accountType) payload.accountType = accountType;
    return await this.refs.getOutsourceDeliveryCallable()(payload);
  }

  async getOutsourceDeliveryQuotation(orderId: string) {
    const payload: OrderPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
    };
    return await this.refs.getOutsourceDeliveryQuotationCallable()(payload);
  }

  // order notes
  observeOrderNotes(
    orderId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getOrderNotesRef(orderId),
      orderBy('createdOn', 'desc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  async createOrderNote(orderId: string, data: Partial<ProfileNote>) {
    const timestamp = serverTimestamp();
    await addDoc(this.refs.getOrderNotesRef(orderId), {
      ...data,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as ProfileNote);
  }

  async updateOrderNote(
    orderId: string,
    orderNoteId: string,
    changes: Partial<ProfileNote>
  ) {
    const timestamp = serverTimestamp();
    await updateDoc(this.refs.getOrderNoteRef(orderId, orderNoteId), {
      ...changes,
      updatedOn: timestamp,
    } as Partial<ProfileNote>);
  }

  async deleteOrderNote(orderId: string, orderNoteId: string) {
    await deleteDoc(this.refs.getOrderNoteRef(orderId, orderNoteId));
  }

  async getOrderConfirmationPictureURL(
    orderId: string,
    courierId: string,
    type: 'front' | 'package' = 'front'
  ) {
    return await this.files.getDownloadURL(
      this.refs.getOrderConsumerStoragePath(orderId, courierId, type)
    );
  }
}
