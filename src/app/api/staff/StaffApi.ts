import {
  ConsumerProfile,
  CreateManagersPayload,
  GetManagersPayload,
  NewUserData,
  StaffProfile,
  UserPermissions,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentAs, documentsAs, FirebaseDocument } from 'core/fb';
import { FirebaseError } from 'firebase/app';
import {
  DocumentData,
  getDoc,
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
        permissions: UserPermissions;
      };
      return data;
    } catch (error) {
      //@ts-ignore
      Sentry.captureException(error);
      return null;
    }
  }

  async updateProfile(id: string, changes: Partial<StaffProfile>) {
    await updateDoc(this.refs.getStaffRef(id), changes);
  }

  async createStaff(staff: NewUserData) {
    const payload: CreateManagersPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      type: 'staff',
      usersData: [staff],
    };
    const result = await this.refs.getCreateManagersCallable()(payload);
    return result;
  }

  async getNotificationToken(staffId: string) {
    const consumerSnapshot = await getDoc(this.refs.getConsumerRef(staffId));
    if (consumerSnapshot.exists()) {
      const consumer = documentAs<ConsumerProfile>(consumerSnapshot);
      const { notificationToken } = consumer;
      if (notificationToken) {
        return updateDoc(this.refs.getStaffRef(staffId), { notificationToken });
      }
      throw new FirebaseError(
        'ignored-error',
        'Documento de consumer não possui notificationToken.'
      );
    }
    throw new FirebaseError('ignored-error', 'Nenhum perfil de consumer encontrado.');
  }
}
