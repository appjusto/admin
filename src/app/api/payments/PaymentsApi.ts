import { Payment, PaymentStatus, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentsAs, FirebaseDocument } from 'core/fb';
import {
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import {
  customCollectionSnapshot,
  customDocumentSnapshot,
  queryLimit,
} from '../utils';

export default class PaymentsApi {
  constructor(private refs: FirebaseRefs) {}

  // observeDashboardInvoices(
  //   resultHandler: (orders: WithId<Invoice>[]) => void,
  //   businessId?: string | null,
  //   start?: Date | null,
  //   end?: Date | null,
  //   invoiceStatuses?: IuguInvoiceStatus[]
  // ): Unsubscribe {
  //   const q = query(
  //     this.refs.getInvoicesRef(),
  //     orderBy('updatedOn', 'desc'),
  //     where('accountId', '==', businessId),
  //     where('status', 'in', invoiceStatuses),
  //     where('updatedOn', '>=', start),
  //     where('updatedOn', '<=', end)
  //   );
  //   // returns the unsubscribe function
  //   return customCollectionSnapshot(q, resultHandler);
  // }

  observeOrderPayments(
    orderId: string,
    resultHandler: (invoices: WithId<Payment>[]) => void
    // businessId?: string
  ): Unsubscribe {
    let q = query(
      this.refs.getPaymentsRef(),
      orderBy('createdAt', 'asc'),
      where('order.id', '==', orderId)
    );
    // if (businessId) q = query(q, where('accountId', '==', businessId));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler, {
      avoidPenddingWrites: false,
      captureException: true,
    });
  }

  observePayments(
    resultHandler: (
      payments: WithId<Payment>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    orderCode?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfterDoc?: FirebaseDocument,
    status?: PaymentStatus
  ): Unsubscribe {
    let q = query(
      this.refs.getInvoicesRef(),
      orderBy('createdAt', 'desc'),
      limit(queryLimit)
    );
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (orderCode) q = query(q, where('order.code', '==', orderCode));
    if (start && end)
      q = query(
        q,
        where('createdAt', '>=', start),
        where('createdAt', '<=', end)
      );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[querySnapshot.size - 1]
            : undefined;
        resultHandler(documentsAs<Payment>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observePaymentsStatusesByPeriod(
    businessId: string,
    start: Date,
    end: Date,
    statuses: PaymentStatus[],
    resultHandler: (payments: WithId<Payment>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getInvoicesRef(),
      orderBy('createdAt', 'desc'),
      where('accountId', '==', businessId),
      where('status', 'in', statuses),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observePayment(
    paymentId: string,
    resultHandler: (payment: WithId<Payment>) => void
  ): Unsubscribe {
    const ref = this.refs.getPaymentRef(paymentId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Payment>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }
}
