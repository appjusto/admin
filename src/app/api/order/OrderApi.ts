import {
  CancelOrderPayload,
  DropOrderPayload,
  Invoice,
  Issue,
  LedgerEntry,
  LedgerEntryStatus,
  MatchOrderPayload,
  Order,
  OrderCancellation,
  OrderCancellationParams,
  OrderConfirmation,
  OrderFraudPreventionFlags,
  OrderIssue,
  OrderLog,
  OrderMatching,
  OrderStatus,
  OrderType,
  OutsourceAccountType,
  OutsourceDeliveryPayload,
  ProfileNote,
  WithId
} from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
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
  where
} from 'firebase/firestore';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { InQueryArray } from '../types';
import { customCollectionSnapshot, customDocumentSnapshot, queryLimit } from '../utils';

export type CancellationData = {
  issue: WithId<Issue>;
  canceledById: string;
  comment?: string;
};

export type Ordering = 'asc' | 'desc';

export type OrderLogType = 'change' | 'payment' | 'info' | 'matching' | 'courier-location';

export default class OrderApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  observeOrders(
    statuses: OrderStatus[],
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: Ordering = 'desc'
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('timestamps.charged', ordering),
      where('status', 'in', statuses)
    );

    if (businessId) {
      q = query(q, where('business.id', '==', businessId));
    }
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeScheduledOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: Ordering = 'asc'
  ): Unsubscribe {
    const lastWeedDay = dayjs().add(7, 'day').toDate();
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('scheduledTo', ordering),
      where('business.id', '==', businessId),
      where('status', '==', 'scheduled'),
      where('scheduledTo', '<=', lastWeedDay)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeBusinessOrdersCompletedInTheLastHour(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string,
    ordering: Ordering = 'desc'
  ): Unsubscribe {
    const statuses = ['delivered', 'canceled'] as OrderStatus[];
    const baseTim = new Date();
    baseTim.setHours(baseTim.getHours() - 1);
    const q = query(
      this.refs.getOrdersRef(),
      orderBy('updatedOn', ordering),
      where('business.id', '==', businessId),
      where('status', 'in', statuses),
      where('updatedOn', '>', baseTim)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeDashboardOrders(
    resultHandler: (orders: WithId<Order>[]) => void,
    businessId?: string | null,
    start?: Date | null,
    end?: Date | null,
    orderStatus?: OrderStatus
  ): Unsubscribe {
    const q = query(
      this.refs.getOrdersRef(),
      orderBy('updatedOn', 'desc'),
      where('business.id', '==', businessId),
      where('status', '==', orderStatus),
      where('updatedOn', '>=', start),
      where('updatedOn', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeDashboardInvoices(
    resultHandler: (orders: WithId<Invoice>[]) => void,
    businessId?: string | null,
    start?: Date | null,
    end?: Date | null,
    invoiceStatus?: IuguInvoiceStatus
  ): Unsubscribe {
    const q = query(
      this.refs.getInvoicesRef(),
      orderBy('updatedOn', 'desc'),
      where('accountId', '==', businessId),
      where('status', '==', invoiceStatus),
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
    resultHandler: (orders: WithId<Order>[], last?: QueryDocumentSnapshot<DocumentData>) => void,
    businessId: string | null | undefined,
    statuses: InQueryArray<OrderStatus> | null,
    orderCode: string | null | undefined,
    start: Date | null | undefined,
    end: Date | null | undefined,
    orderStatus: OrderStatus | undefined,
    orderType: OrderType | null,
    startAfterDoc: FirebaseDocument | undefined
  ): Unsubscribe {
    let q = query(this.refs.getOrdersRef(), orderBy('updatedOn', 'desc'), limit(queryLimit));
    if (orderStatus) q = query(q, where('status', '==', orderStatus));
    else q = query(q, where('status', 'in', statuses));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (businessId) q = query(q, where('business.id', '==', businessId));
    if (orderCode) q = query(q, where('code', '==', orderCode));
    if (start && end) q = query(q, where('updatedOn', '>=', start), where('updatedOn', '<=', end));
    if (orderType) q = query(q, where('type', '==', orderType));
    const unsubscribe = onSnapshot(
      q,
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
    resultHandler: (orders: WithId<Order>[], last?: QueryDocumentSnapshot<DocumentData>) => void,
    businessId: string | undefined,
    statuses: OrderStatus[] | null,
    orderCode?: string | null,
    start?: Date | null,
    end?: Date | null,
    orderStatus?: OrderStatus,
    startAfterDoc?: FirebaseDocument
  ): Unsubscribe {
    let q = query(
      this.refs.getOrdersRef(),
      orderBy('updatedOn', 'desc'),
      limit(queryLimit),
      where('business.id', '==', businessId),
      where('status', 'in', statuses)
    );
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (orderCode) q = query(q, where('code', '==', orderCode));
    if (start && end) q = query(q, where('updatedOn', '>=', start), where('updatedOn', '<=', end));
    if (orderStatus) q = query(q, where('status', '==', orderStatus));
    const unsubscribe = onSnapshot(
      q,
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

  observeOrder(orderId: string, resultHandler: (order: WithId<Order>) => void): Unsubscribe {
    const ref = this.refs.getOrderRef(orderId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Order>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }

  observeOrderByOrderCode(orderCode: string, resultHandler: (order: WithId<Order>) => void) {
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

  observeOrderIssues(
    orderId: string,
    resultHandler: (orderIssues: WithId<OrderIssue>[]) => void
  ): Unsubscribe {
    const q = query(this.refs.getOrderIssuesRef(orderId), orderBy('createdOn', 'desc'));
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
        if (querySnapshot.exists()) resultHandler(querySnapshot.data() as OrderMatching);
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
        if (querySnapshot.exists()) resultHandler(querySnapshot.data() as OrderConfirmation);
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
    if(statuses) {
      q = query(q, where('status', 'in', statuses))
    }
    if(start && end) {
      q = query(
        q, 
        where('timestamps.confirmed', '>=', start), 
        where('timestamps.confirmed', '<=', end)
      )
    }
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderInvoices(
    orderId: string,
    resultHandler: (invoices: WithId<Invoice>[]) => void,
    businessId?: string
  ): Unsubscribe {
    let q = query(
      this.refs.getInvoicesRef(),
      orderBy('createdOn', 'asc'),
      where('orderId', '==', orderId)
    );
    if (businessId) q = query(q, where('accountId', '==', businessId));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeInvoices(
    resultHandler: (
      invoices: WithId<Invoice>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    orderCode?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfterDoc?: FirebaseDocument,
    status?: IuguInvoiceStatus
  ): Unsubscribe {
    let q = query(this.refs.getInvoicesRef(), orderBy('createdOn', 'desc'), limit(queryLimit));
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (orderCode) q = query(q, where('orderCode', '==', orderCode));
    if (start && end) q = query(q, where('createdOn', '>=', start), where('createdOn', '<=', end));
    const unsubscribe = onSnapshot(
      q,
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
  ): Unsubscribe {
    const q = query(
      this.refs.getInvoicesRef(),
      orderBy('createdOn', 'desc'),
      where('accountId', '==', businessId),
      where('status', '==', status),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeInvoice(
    invoiceId: string,
    resultHandler: (invoice: WithId<Invoice>) => void
  ): Unsubscribe {
    const ref = this.refs.getInvoiceRef(invoiceId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Invoice>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }

  observeLedger(
    resultHandler: (
      entries: WithId<LedgerEntry>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    orderId?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfterDoc?: FirebaseDocument,
    status?: LedgerEntryStatus
  ): Unsubscribe {
    let q = query(this.refs.getLedgerRef(), orderBy('createdOn', 'desc'), limit(queryLimit));
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (orderId) q = query(q, where('orderId', '==', orderId));
    if (start && end) q = query(q, where('createdOn', '>=', start), where('createdOn', '<=', end));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<LedgerEntry>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeLedgerEntry(
    entryId: string,
    resultHandler: (entry: WithId<LedgerEntry>) => void
  ): Unsubscribe {
    const ref = this.refs.getLedgerEntryRef(entryId);
    // returns the unsubscribe function
    return customDocumentSnapshot<LedgerEntry>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }

  async getOrderIdByCode(orderCode: string) {
    const q = query(this.refs.getOrdersRef(), where('code', '==', orderCode));
    const orderId = await getDocs(q).then((snapshot) => {
      if (!snapshot.empty) return snapshot.docs[0].id;
      else throw new FirebaseError('ignored-error', 'Não foi possível encontrar o pedido.');
    });
    return orderId;
  }

  async getOrderPrivateCancellation(orderId: string) {
    const doc = await getDoc(this.refs.getOrderCancellationRef(orderId));
    if (!doc.exists) return null;
    return doc.data() as OrderCancellation;
  }

  async updateOrderCourierNotified(orderId: string, couriersNotified: string[]) {
    return updateDoc(this.refs.getOrderMatchingRef(orderId), { couriersNotified });
  }

  async getOrderIssues(orderId: string) {
    const q = query(this.refs.getOrderIssuesRef(orderId), orderBy('createdOn', 'desc'));
    const data = await getDocs(q);
    return documentsAs<OrderIssue>(data.docs);
  }

  async fetchOrderById(orderId: string) {
    const data = await getDoc(this.refs.getOrderRef(orderId));
    if (data.exists()) return documentAs<Order>(data);
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
            refund: ['products', 'delivery', 'platform'],
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
      throw new FirebaseError('ignored-error', 'O pedido informado não existe.');
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

  async getOutsourceDelivery(orderId: string, accountType?: OutsourceAccountType) {
    const payload: OutsourceDeliveryPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      orderId,
    };
    if (accountType) payload.accountType = accountType;
    return await this.refs.getOutsourceDeliveryCallable()(payload);
  }

  // order notes
  observeOrderNotes(
    orderId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): Unsubscribe {
    const q = query(this.refs.getOrderNotesRef(orderId), orderBy('createdOn', 'desc'));
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

  async updateOrderNote(orderId: string, orderNoteId: string, changes: Partial<ProfileNote>) {
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
