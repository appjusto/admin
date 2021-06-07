import * as Sentry from '@sentry/react';
import { AdminRole, CreateManagerPayload, ManagerProfile, Role, WithId } from 'appjusto-types';
import { GetBusinessManagersPayload } from 'appjusto-types/payloads/profile';
import { documentsAs } from 'core/fb';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';
import { ManagerWithRole } from './types';

export default class ManagerApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  observeProfile(
    id: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getManagerRef(id).onSnapshot(
      async (doc) => {
        if (!doc.exists) resultHandler(null);
        else resultHandler({ ...(doc.data() as ManagerProfile), id });
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeProfileByEmail(
    email: string,
    resultHandler: (profile: WithId<ManagerProfile> | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getManagersRef().where('email', '==', email);
    const unsubscribe = query.onSnapshot(
      async (querySnapshot) => {
        const data = documentsAs<ManagerProfile>(querySnapshot.docs);
        resultHandler(data[0]);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
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
      const users = await this.refs.getGetBusinessManagers()(payload);
      resultHandler(users.data);
    } catch (error) {
      Sentry.captureException('createManagerError', error);
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

  async createManager(data: { email: string; key: string; role: Role | AdminRole }) {
    const { email, key, role } = data;
    const payload: CreateManagerPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      email,
      key,
      role,
    };
    try {
      await this.refs.getCreateManager()(payload);
      return true;
    } catch (error) {
      Sentry.captureException('createManagerError', error);
      return false;
    }
  }
}
