import { useApi } from 'app/api/context';
import firebase from 'firebase/app';
import React, { useEffect } from 'react';

interface FirebaseUserContextInterface {
  firebaseUser: firebase.User | undefined | null;
  setFirebaseUser: React.Dispatch<React.SetStateAction<firebase.User | undefined | null>>;
}

const FirebaseUserContext = React.createContext<FirebaseUserContextInterface | undefined>(
  undefined
);

export const FirebaseUserProvider = (
  props: Omit<React.ProviderProps<FirebaseUserContextInterface>, 'value'>
) => {
  const api = useApi()!;
  const [firebaseUser, setFirebaseUser] = React.useState<firebase.User | undefined | null>(
    undefined
  );
  const value: FirebaseUserContextInterface = React.useMemo(
    () => ({ firebaseUser, setFirebaseUser }),
    [firebaseUser]
  );
  useEffect(() => {
    return api.auth().observeAuthState((user) => {
      setFirebaseUser(user);
    });
  }, [api]);

  return (
    <FirebaseUserContext.Provider value={value}>{props.children}</FirebaseUserContext.Provider>
  );
};

export const useFirebaseUser = () => {
  return React.useContext(FirebaseUserContext)?.firebaseUser;
};
