import {
  BackofficePermissions,
  CreateManagersPayload,
  GetManagersPayload,
  NewStaffData,
  StaffProfile,
  WithId,
} from '@appjusto/types';
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
  updateDoc,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customDocumentSnapshot } from '../utils';

export default class StaffApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<StaffProfile> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getStaffRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  observeStaffs(
    resultHandler: (
      staff: WithId<StaffProfile>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    startAfterDoc?: FirebaseDocument
  ): Unsubscribe {
    let q = query(this.refs.getStaffsRef(), orderBy('email'), limit(10));
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    // returns the unsubscribe function
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.metadata.hasPendingWrites) {
          const last =
            snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;
          resultHandler(documentsAs<StaffProfile>(snapshot.docs), last);
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

  async getStaff(staffId: string) {
    const payload: GetManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'staff',
      staffId,
    };
    try {
      const result = await this.refs.getGetManagersCallable()(payload);
      const data = result.data as {
        staff: WithId<StaffProfile>;
        permissions: BackofficePermissions;
      };
      return data;
    } catch (error) {
      //@ts-ignore
      Sentry.captureException(error);
      return null;
    }
  }

  // public async createProfile(id: string, email: string) {
  //   const data = await getDoc(this.refs.getAgentRef(id));
  //   if (!data.exists()) {
  //     await setDoc(this.refs.getAgentRef(id), {
  //       situation: 'pending',
  //       email,
  //     } as Partial<StaffProfile>);
  //   }
  // }

  async updateProfile(id: string, changes: Partial<StaffProfile>) {
    await updateDoc(this.refs.getStaffRef(id), changes);
  }

  async createStaff(staff: NewStaffData) {
    const payload: CreateManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'staff',
      staff,
    };
    const result = await this.refs.getCreateManagersCallable()(payload);
    return result;
  }
}
