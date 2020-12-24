import { useContextApi } from 'app/state/api/context';
import firebase from 'firebase/app';
import React from 'react';

export const useFirebaseUser = () => {
  // contex
  const api = useContextApi();

  // state
  const [firebaseUser, setFirebaseUser] = React.useState<firebase.User | undefined | null>(
    undefined
  );

  // side effects
  React.useEffect(() => {
    return api.auth().observeAuthState((user) => {
      setFirebaseUser(user);
    });
  }, [api]);

  // return
  return firebaseUser;
};
