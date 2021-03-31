import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import firebase from 'firebase/app';
import React from 'react';

const FirebaseUserContext = React.createContext<firebase.User | undefined | null>(undefined);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const FirebaseUserProvider = ({ children }: Props) => {
  const firebaseUser = useFirebaseUser();

  return (
    <FirebaseUserContext.Provider value={firebaseUser}>{children}</FirebaseUserContext.Provider>
  );
};

export const useContextFirebaseUser = () => {
  return React.useContext(FirebaseUserContext);
};

export const useContextFirebaseUserId = () => {
  const user = useContextFirebaseUser();
  console.dir(user);
  return user?.uid;
};

export const useContextFirebaseUserEmail = () => {
  const user = useContextFirebaseUser();
  return user?.email;
};
