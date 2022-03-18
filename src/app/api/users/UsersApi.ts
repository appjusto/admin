import { ProfileChange, User, UserProfile, UserType, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import {
  DocumentData,
  getDoc,
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
import { documentAs, documentsAs, FirebaseDocument } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';
import { queryLimit } from '../utils';
import { ProfileChangesSituations } from './useObserveUsersChanges';

export type UsersSearchType = 'email' | 'cpf' | 'phone';
export default class UsersApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeUsers(
    resultHandler: (users: WithId<User>[], last?: QueryDocumentSnapshot<DocumentData>) => void,
    loggedAt: UserType[] | null,
    isBlocked: boolean,
    searchType?: UsersSearchType,
    search?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfter?: FirebaseDocument
  ): Unsubscribe {
    // query
    if (searchType === 'email' && search) {
      const ref = this.refs.getUserRef(search);
      const unsubscribe = onSnapshot(
        ref,
        (querySnapshot) => {
          if (querySnapshot.exists()) resultHandler([documentAs<User>(querySnapshot)]);
          else resultHandler([]);
        },
        (error) => {
          console.error(error);
          Sentry.captureException(error);
        }
      );
      // returns the unsubscribe function
      return unsubscribe;
    }
    let q = query(this.refs.getUsersRef(), orderBy('lastSignInRequest', 'desc'), limit(queryLimit));
    // search
    if (startAfter) q = query(q, startAfter(startAfter));
    if (searchType === 'cpf' && search) q = query(q, where('cpf', '==', search));
    if (searchType === 'phone' && search) q = query(q, where('phone', '==', search));
    // filters
    //if (loggedAt?.includes('consumer')) q = query(q, where('consumer', '!=', false));
    //if (loggedAt?.includes('courier')) q = query(q, where('courier', '!=', false));
    //if (loggedAt?.includes('manager')) q = query(q, where('manager', '!=', false));
    if (isBlocked) q = query(q, where('blocked', '==', true));
    if (start && end)
      q = query(q, where('lastSignInRequest', '>=', start), where('lastSignInRequest', '<=', end));
    // observer
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<User>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeUser(userId: string, resultHandler: (user: WithId<User> | null) => void): Unsubscribe {
    // query
    let ref = this.refs.getUserRef(userId);
    // observer
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        if (querySnapshot.exists()) resultHandler(documentAs<User>(querySnapshot));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeUsersChanges(
    resultHandler: (
      changes: WithId<ProfileChange>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    situations: ProfileChangesSituations[],
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  ): Unsubscribe {
    // query
    let q = query(
      this.refs.getUsersChangesRef(),
      orderBy('createdOn', 'asc'),
      where('situation', 'in', situations)
    );
    // observer
    if (startAfter) q = query(q, startAfter(startAfterDoc));
    // returns the unsubscribe function
    return onSnapshot(
      q,
      (snapshot) => {
        const last = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;
        resultHandler(documentsAs<ProfileChange>(snapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
  }

  observeUserChange(
    changeId: string,
    resultHandler: (change: WithId<ProfileChange> | null) => void
  ): Unsubscribe {
    // query
    let ref = this.refs.getUsersChangeRef(changeId);
    // observer
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        if (querySnapshot.exists()) resultHandler(documentAs<ProfileChange>(querySnapshot));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async updateUser(userId: string, changes: Partial<User>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      const ref = this.refs.getUserRef(userId);
      await updateDoc(ref, fullChanges);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async fetchUserData(accountId: string, userType: UserType): Promise<WithId<UserProfile> | null> {
    try {
      if (userType === 'courier') {
        const courier = await getDoc(this.refs.getCourierRef(accountId));
        if (courier.exists()) return documentAs<UserProfile>(courier);
      } else if (userType === 'consumer') {
        const consumer = await getDoc(this.refs.getConsumerRef(accountId));
        if (consumer.exists()) return documentAs<UserProfile>(consumer);
      } else if (userType === 'manager') {
        const manager = await getDoc(this.refs.getManagerRef(accountId));
        if (manager) return documentAs<UserProfile>(manager);
      }
      return null;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateChanges(changesId: string, changes: Partial<ProfileChange>) {
    try {
      await updateDoc(this.refs.getUsersChangeRef(changesId), changes);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
