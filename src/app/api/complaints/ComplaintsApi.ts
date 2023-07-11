import { Complaint, ComplaintStatus, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentsAs, FirebaseDocument } from 'core/fb';
import {
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
import { customDocumentSnapshot } from '../utils';

export default class ComplaintsApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeComplaints(
    resultHandler: (
      Complaints: WithId<Complaint>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    status?: ComplaintStatus,
    complaintCode?: string,
    orderId?: string,
    courierId?: string,
    start?: Date | null,
    end?: Date | null,
    startAfterDoc?: FirebaseDocument
  ): Unsubscribe {
    let q = query(
      this.refs.getComplaintsRef(),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    if (complaintCode) q = query(q, where('code', '==', complaintCode));
    else if (orderId) q = query(q, where('orderId', '==', orderId));
    else if (courierId) q = query(q, where('createdBy', '==', courierId));
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
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
        resultHandler(documentsAs<Complaint>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeComplaint(
    complaintId: string,
    resultHandler: (complaint: WithId<Complaint> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getComplaintRef(complaintId);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  async updateComplaint(complaintId: string, changes: Partial<Complaint>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedAt: timestamp,
    } as Partial<Complaint>;
    await updateDoc(this.refs.getComplaintRef(complaintId), fullChanges);
  }
}
