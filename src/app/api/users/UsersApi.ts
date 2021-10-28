import * as Sentry from '@sentry/react';
import { WithId, User } from 'appjusto-types';
import { documentsAs } from '../../../core/fb';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';

export type UsersSearchType = 'email' | 'cpf' | 'phone';

export type UserType = 'consumer' | 'manager' | 'courier';

export default class UsersApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeUsers(
    resultHandler: (
      orders: WithId<User>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    loggedAt: UserType[],
    searchType?: UsersSearchType,
    search?: string,
    isBlocked?: boolean,
    start?: Date | null,
    end?: Date | null
  ): firebase.Unsubscribe {
    console.log(searchType);
    console.log(search);
    let query = this.refs.getUsersRef().orderBy('lastSignInRequest', 'desc').limit(20);
    // search
    if (searchType === 'email' && search) query.where('email', '==', search);
    if (searchType === 'cpf' && search) query.where('cpf', '==', search);
    if (searchType === 'phone' && search) query.where('phone', '==', search);
    // filters
    if (loggedAt.includes('consumer')) query.where('consumer', '!=', '');
    if (loggedAt.includes('courier')) query.where('courier', '>', '');
    if (loggedAt.includes('manager')) query.where('manager', '>', '');
    if (isBlocked) query.where('blocked', '==', 'true');
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
}
