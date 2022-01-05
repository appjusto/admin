import * as Sentry from '@sentry/react';
import {
  Business,
  CreateManagersPayload,
  ManagerProfile,
  NewManagerData,
  WithId,
} from 'appjusto-types';
import { GetBusinessManagersPayload } from 'appjusto-types/payloads/profile';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';
import { ManagerWithRole } from './types';

export default class ManagerApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getManagerRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot(query, resultHandler);
  }

  observeProfileByEmail(
    email: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getManagersRef().where('email', '==', email);
    // returns the unsubscribe function
    return customCollectionSnapshot<ManagerProfile>(query, (result) => {
      resultHandler(result[0]);
    });
  }

  observeManagerBusinesses(
    email: string,
    resultHandler: (businesses: WithId<Business>[] | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessesRef().where('managers', 'array-contains', email);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  async getBusinessManagers(
    businessId: string,
    resultHandler: (result: ManagerWithRole[]) => void
  ) {
    const payload: GetBusinessManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      businessId,
    };
    try {
      const users = await this.refs.getGetBusinessManagersCallable()(payload);
      resultHandler(users.data);
    } catch (error) {
      //@ts-ignore
      Sentry.captureException(error);
      return null;
    }
  }

  public async createProfile(id: string, email: string) {
    const data = (await this.refs.getManagerRef(id).get()).data();
    if (!data) {
      await this.refs.getManagerRef(id).set({
        situation: 'pending',
        email,
      } as Partial<ManagerProfile>);
    }
  }

  async updateProfile(id: string, changes: Partial<ManagerProfile>) {
    await this.refs.getManagerRef(id).update(changes);
  }

  async createManager(data: { key: string; managers: NewManagerData[] }) {
    const { key, managers } = data;
    const payload: CreateManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      key,
      managers,
    };
    const result = await this.refs.getCreateManagersCallable()(payload);
    return result;
  }
}
