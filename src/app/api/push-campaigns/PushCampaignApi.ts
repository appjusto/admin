import { PushCampaign, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentsAs, FirebaseDocument } from 'core/fb';
import {
  addDoc,
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

export default class PushCampaignApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observePushCampaign(
    campaignId: string,
    resultHandler: (campaign: WithId<PushCampaign> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getPushCampaignRef(campaignId);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  observePushCampaigns(
    resultHandler: (
      campaigns: WithId<PushCampaign>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    name?: string,
    start?: Date | null,
    end?: Date | null,
    startAfterDoc?: FirebaseDocument,
    status?: PushCampaign['status']
  ): Unsubscribe {
    let q = query(
      this.refs.getPushCampaignsRef(),
      orderBy('createdOn', 'desc'),
      limit(10)
    );
    // if (name) q = query(q, where('name', '==', name));
    if (status) q = query(q, where('status', '==', status));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
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
        resultHandler(documentsAs<PushCampaign>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async submitPushCampaign(data: Partial<PushCampaign>) {
    const timestamp = serverTimestamp();
    const fullData = {
      ...data,
      createdOn: timestamp,
    } as Partial<PushCampaign>;
    await addDoc(this.refs.getPushCampaignsRef(), fullData);
  }

  async updatePushCampaign(campaignId: string, changes: Partial<PushCampaign>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    } as Partial<PushCampaign>;
    await updateDoc(this.refs.getStaffRef(campaignId), fullChanges);
  }
}
