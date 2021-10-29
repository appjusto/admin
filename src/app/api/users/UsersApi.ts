import * as Sentry from '@sentry/react';
import { WithId, User } from 'appjusto-types';
import { documentAs, documentsAs, FirebaseDocument } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';

export type UsersSearchType = 'email' | 'cpf' | 'phone';

export type UserType = 'consumer' | 'manager' | 'courier';

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
    //console.log({
    //  searchType: searchType,
    //  search: search,
    //  isBlocked: isBlocked,
    //  start: start,
    //  end: end,
    //});
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
    let query = this.refs.getUsersRef().orderBy('lastSignInRequest', 'desc').limit(20);
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
}
