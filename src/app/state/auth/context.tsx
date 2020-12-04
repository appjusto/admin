import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import firebase from 'firebase/app';
import React from 'react';

type FirebaseUser = firebase.User | undefined | null;

const FirebaseUserContext = React.createContext<FirebaseUser | undefined>(undefined);

export const FirebaseUserProvider = (props: Omit<React.ProviderProps<FirebaseUser>, 'value'>) => {
  const firebaseUser = useFirebaseUser();

  return (
    <FirebaseUserContext.Provider value={firebaseUser}>
      {props.children}
    </FirebaseUserContext.Provider>
  );
};

export const useContextFirebaseUser = () => {
  return React.useContext(FirebaseUserContext);
};
