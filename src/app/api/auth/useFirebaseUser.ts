import * as Sentry from '@sentry/react';
import { useContextApi } from 'app/state/api/context';
import { User } from 'firebase/auth';
import React from 'react';

export const useFirebaseUser = () => {
  // contex
  const api = useContextApi();
  // state
  const [firebaseUser, setFirebaseUser] = React.useState<User | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.auth().observeAuthState((user) => {
      if (user) Sentry.setUser({ id: user.uid, email: user.email! });
      else Sentry.configureScope((scope) => scope.setUser(null));
      setFirebaseUser(user);
    });
    return () => unsub();
  }, [api]);
  // return
  return firebaseUser;
};
