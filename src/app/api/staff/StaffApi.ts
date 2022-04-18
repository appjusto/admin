import {
  BackofficePermissions,
  CreateManagersPayload,
  GetManagersPayload,
  NewStaffData,
  StaffProfile,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { orderBy, query, Unsubscribe, updateDoc } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

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

  observeStaffs(resultHandler: (staff: WithId<StaffProfile>[] | null) => void): Unsubscribe {
    const q = query(this.refs.getStaffsRef(), orderBy('email'));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler, {
      avoidPenddingWrites: false,
      captureException: true,
    });
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
