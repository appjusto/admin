import { LedgerEntry, LedgerEntryStatus, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentsAs, FirebaseDocument } from 'core/fb';
import {
  addDoc,
  deleteDoc,
  DocumentData,
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
import { customDocumentSnapshot, queryLimit } from '../utils';

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
