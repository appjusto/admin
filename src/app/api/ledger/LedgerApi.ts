import {
  LedgerEntry,
  LedgerEntryOperation,
  LedgerEntryStatus,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentsAs, FirebaseDocument } from 'core/fb';
import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import {
  customCollectionSnapshot,
  customDocumentSnapshot,
  queryLimit,
} from '../utils';

export default class LedgerApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
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
    let q = query(
      this.refs.getLedgerRef(),
      orderBy('createdOn', 'desc'),
      limit(queryLimit)
    );
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (orderId) q = query(q, where('orderId', '==', orderId));
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

  observeBusinessLedgerByPeriod(
    resultHandler: (entries: WithId<LedgerEntry>[]) => void,
    businessId: string,
    statuses: LedgerEntryStatus[],
    start: Date,
    end: Date
  ): Unsubscribe {
    const q = query(
      this.refs.getLedgerRef(),
      orderBy('createdOn', 'desc'),
      where('to.accountId', '==', businessId),
      where('status', 'in', statuses),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    return customCollectionSnapshot(q, resultHandler);
  }

  async fetchBusinessLedgerByPeriod(
    businessId: string,
    statuses: LedgerEntryStatus[],
    start: Date,
    end: Date
  ) {
    const toQ = query(
      this.refs.getLedgerRef(),
      orderBy('createdOn', 'desc'),
      where('to.accountId', '==', businessId),
      where('status', 'in', statuses),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    const toSnapshot = await getDocs(toQ);
    const toBusiness = documentsAs<LedgerEntry>(toSnapshot.docs);
    const fromQ = query(
      this.refs.getLedgerRef(),
      orderBy('createdOn', 'desc'),
      where('from.accountId', '==', businessId),
      where('status', 'in', statuses),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    const fromSnapshot = await getDocs(fromQ);
    const fromBusiness = documentsAs<LedgerEntry>(fromSnapshot.docs);
    return toBusiness.concat(fromBusiness);
  }

  async fetchBusinessSubscriptionLedgerByPeriod(
    businessId: string,
    start: Date,
    end: Date
  ) {
    // operation business-subscription
    const q = query(
      this.refs.getLedgerRef(),
      orderBy('createdOn', 'desc'),
      where('from.accountId', '==', businessId),
      where('operation', '==', 'business-subscription'),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    const snapshot = await getDocs(q);
    return documentsAs<LedgerEntry>(snapshot.docs);
  }

  async fetchBusinessApprovedLedgersByOperation(
    businessId: string,
    operations: LedgerEntryOperation[]
  ) {
    const q = query(
      this.refs.getLedgerRef(),
      where('from.accountId', '==', businessId),
      where('status', '==', 'approved'),
      where('operation', 'in', operations)
    );
    const snapshot = await getDocs(q);
    return documentsAs<LedgerEntry>(snapshot.docs);
  }

  observeLedgerByOrderIdAndOperation(
    businessId: string,
    orderId: string,
    operation: LedgerEntryOperation,
    statuses: LedgerEntryStatus[],
    resultHandler: (entries: WithId<LedgerEntry>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getLedgerRef(),
      orderBy('createdOn', 'desc'),
      where('to.accountId', '==', businessId),
      where('orderId', '==', orderId),
      where('operation', '==', operation),
      where('status', 'in', statuses)
    );
    return customCollectionSnapshot(q, resultHandler);
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

  async submitLedgerEntry(data: Partial<LedgerEntry>) {
    const timestamp = serverTimestamp();
    const fullData = {
      ...data,
      createdOn: timestamp,
    } as Partial<LedgerEntry>;
    await addDoc(this.refs.getLedgerRef(), fullData);
  }

  async updateLedgerEntry(entryId: string, changes: Partial<LedgerEntry>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    } as Partial<LedgerEntry>;
    await updateDoc(this.refs.getLedgerEntryRef(entryId), fullChanges);
  }

  async deleteLedgerEntry(entryId: string) {
    await deleteDoc(this.refs.getLedgerEntryRef(entryId));
  }
}
