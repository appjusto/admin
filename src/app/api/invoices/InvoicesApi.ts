import { Invoice, WithId } from '@appjusto/types';
import { IuguInvoiceStatus } from '@appjusto/types/payment/iugu';
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

export default class InvoicesApi {
  constructor(private refs: FirebaseRefs) {}

  observeDashboardInvoices(
    resultHandler: (orders: WithId<Invoice>[]) => void,
    businessId?: string | null,
    start?: Date | null,
    end?: Date | null,
    invoiceStatuses?: IuguInvoiceStatus[]
  ): Unsubscribe {
    const q = query(
      this.refs.getInvoicesRef(),
      orderBy('updatedOn', 'desc'),
      where('accountId', '==', businessId),
      where('status', 'in', invoiceStatuses),
      where('updatedOn', '>=', start),
      where('updatedOn', '<=', end)
    );
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
    return customCollectionSnapshot(q, resultHandler, {
      captureException: true,
      avoidPenddingWrites: false,
    });
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
    let q = query(
      this.refs.getInvoicesRef(),
      orderBy('createdOn', 'desc'),
      limit(queryLimit)
    );
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (orderCode) q = query(q, where('orderCode', '==', orderCode));
    if (start && end)
      q = query(
        q,
        where('createdOn', '>=', start),
        where('createdOn', '<=', end)
      );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[querySnapshot.size - 1]
            : undefined;
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

  observeInvoicesStatusesByPeriod(
    businessId: string,
    start: Date,
    end: Date,
    statuses: IuguInvoiceStatus[],
    resultHandler: (invoices: WithId<Invoice>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getInvoicesRef(),
      orderBy('createdOn', 'desc'),
      where('accountId', '==', businessId),
      where('status', 'in', statuses),
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
}
