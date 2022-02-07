import * as Sentry from '@sentry/react';
import { WithId, User, ProfileChange, UserProfile, UserType } from 'appjusto-types';
import { documentAs, documentsAs, FirebaseDocument } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { ProfileChangesSituations } from './useObserveUsersChanges';
import { queryLimit } from '../utils';

export type UsersSearchType = 'email' | 'cpf' | 'phone';
export default class UsersApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeUsers(
    resultHandler: (
      users: WithId<User>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    loggedAt: UserType[] | null,
    isBlocked: boolean,
    searchType?: UsersSearchType,
    search?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfter?: FirebaseDocument
  ): firebase.Unsubscribe {
    // query
    if (searchType === 'email' && search) {
      const unsubscribe = this.refs
        .getUsersRef()
        .doc(search)
        .onSnapshot(
          (querySnapshot) => {
            if (querySnapshot.exists) resultHandler([documentAs<User>(querySnapshot)]);
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
    let query = this.refs.getUsersRef().orderBy('lastSignInRequest', 'desc').limit(queryLimit);
    // search
    if (startAfter) query = query.startAfter(startAfter);
    if (searchType === 'cpf' && search) query = query.where('cpf', '==', search);
    if (searchType === 'phone' && search) query = query.where('phone', '==', search);
    // filters
    //if (loggedAt?.includes('consumer')) query = query.where('consumer', '!=', false);
    //if (loggedAt?.includes('courier')) query = query.where('courier', '!=', false);
    //if (loggedAt?.includes('manager')) query = query.where('manager', '!=', false);
    if (isBlocked) query = query.where('blocked', '==', true);
    if (start && end)
      query = query.where('lastSignInRequest', '>=', start).where('lastSignInRequest', '<=', end);
    // observer
    const unsubscribe = query.onSnapshot(
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

  observeUser(
    userId: string,
    resultHandler: (user: WithId<User> | null) => void
  ): firebase.Unsubscribe {
    // query
    let query = this.refs.getUsersRef().doc(userId);
    // observer
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (querySnapshot.exists) resultHandler(documentAs<User>(querySnapshot));
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
    situations: ProfileChangesSituations[],
    resultHandler: (changes: WithId<ProfileChange>[]) => void
  ): firebase.Unsubscribe {
    // query
    let query = this.refs
      .getUsersChangesRef()
      .orderBy('createdOn', 'asc')
      .where('situation', 'in', situations);
    // observer
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => resultHandler(documentsAs<ProfileChange>(querySnapshot.docs)),
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeUserChange(
    changeId: string,
    resultHandler: (change: WithId<ProfileChange> | null) => void
  ): firebase.Unsubscribe {
    // query
    let query = this.refs.getUsersChangesRef().doc(changeId);
    // observer
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (querySnapshot.exists) resultHandler(documentAs<ProfileChange>(querySnapshot));
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
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      await this.refs.getUsersRef().doc(userId).update(fullChanges);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async fetchUserData(accountId: string, userType: UserType): Promise<WithId<UserProfile> | null> {
    try {
      if (userType === 'courier') {
        const courier = await this.refs.getCourierRef(accountId).get();
        if (courier) return documentAs<UserProfile>(courier);
      } else if (userType === 'consumer') {
        const consumer = await this.refs.getConsumerRef(accountId).get();
        if (consumer) return documentAs<UserProfile>(consumer);
      } else if (userType === 'manager') {
        const manager = await this.refs.getManagerRef(accountId).get();
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
      await this.refs.getUsersChangesRef().doc(changesId).update(changes);
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
