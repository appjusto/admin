import React from 'react';
import { useFirebaseUser } from './useFirebaseUser';

export const useFirebaseUserRole = () => {
  // contex
  const user = useFirebaseUser();

  // state
  const [role, setRole] = React.useState<string | undefined | null>(undefined);
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>(null);

  // side effects
  React.useEffect(() => {
    user
      ?.getIdTokenResult()
      .then((token) => {
        const role = (token.claims.role ?? 'not_staff') as string;
        console.dir(role);
        setRole(role);
      })
      .catch((error) => {
        console.dir('role_error', error);
      });
  }, [user]);

  React.useEffect(() => {
    if (role) {
      if (role === 'owner' || role === 'staff' || role === 'viewer') setIsBackofficeUser(true);
      else setIsBackofficeUser(false);
    }
  }, [role]);

  // return
  return { role, isBackofficeUser };
};
