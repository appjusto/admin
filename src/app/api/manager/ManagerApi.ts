import {
  CreateManagersPayload,
  GetManagersPayload,
  ManagerProfile,
  ManagerWithRole,
  NewUserData,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { FirebaseError } from 'firebase/app';
import {
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

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

  async getManagerIdByEmail(email: string) {
    const q = query(this.refs.getManagersRef(), where('email', '==', email));
    const managerId = await getDocs(q).then((snapshot) => {
      if (!snapshot.empty) return snapshot.docs[0].id;
      else
        throw new FirebaseError(
          'ignored-error',
          'Não foi possível encontrar o colaborador.'
        );
    });
    return managerId;
  }

  async getBusinessManagers(
    businessId: string,
    resultHandler: (result: ManagerWithRole[]) => void
  ) {
    const payload: GetManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'managers',
      businessId,
    };
    try {
      const users = (await this.refs.getGetManagersCallable()(
        payload
      )) as unknown as {
        data: ManagerWithRole[];
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
    const timestamp = serverTimestamp();
    await updateDoc(this.refs.getManagerRef(id), {
      ...changes,
      updatedOn: timestamp,
    });
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
