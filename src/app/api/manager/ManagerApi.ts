import {
  CreateManagersPayload,
  GetManagersPayload,
  ManagerProfile,
  NewUserData,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { getDoc, query, setDoc, Unsubscribe, updateDoc, where } from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';
import { ManagerWithPermissions } from './types';

export default class ManagerApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getManagerRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  observeProfileByEmail(
    email: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): Unsubscribe {
    const q = query(this.refs.getManagersRef(), where('email', '==', email));
    // returns the unsubscribe function
    return customCollectionSnapshot<ManagerProfile>(q, (result) => {
      resultHandler(result[0]);
    });
  }

  async getBusinessManagers(
    businessId: string,
    resultHandler: (result: ManagerWithPermissions[]) => void
  ) {
    const payload: GetManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'managers',
      businessId,
    };
    try {
      const users = (await this.refs.getGetManagersCallable()(payload)) as unknown as {
        data: ManagerWithPermissions[];
      };
      resultHandler(users.data);
    } catch (error) {
      //@ts-ignore
      Sentry.captureException(error);
      return null;
    }
  }

  public async createProfile(id: string, email: string) {
    const data = await getDoc(this.refs.getManagerRef(id));
    if (!data.exists()) {
      await setDoc(this.refs.getManagerRef(id), {
        situation: 'pending',
        email,
      } as Partial<ManagerProfile>);
    }
  }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await updateDoc(this.refs.getManagerRef(id), changes);
  }

  async createManager(data: { key: string; managers: NewUserData[] }) {
    const { key, managers } = data;
    const payload: CreateManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'managers',
      key,
      usersData: managers,
    };
    const result = await this.refs.getCreateManagersCallable()(payload);
    return result;
  }
}
