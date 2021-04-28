import React from 'react';
import { useFirebaseUser } from './useFirebaseUser';

export const useFirebaseUserRole = () => {
  // contex
  const user = useFirebaseUser();

  // state
  const [role, setRole] = React.useState<string | undefined | null>(undefined);
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>(null);

  // handlers
  const refreshUserToken = React.useCallback(async () => {
    console.log('RefreshUserToken');
    return await user
      ?.getIdTokenResult()
      .then((token) => {
        const role = (token.claims.role ?? 'not_staff') as string;
        setRole(role);
      })
      .catch((error) => {
        console.dir('role_error', error);
      });
  }, [user]);

  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [user]);

  React.useEffect(() => {
    if (role) {
      if (role === 'owner' || role === 'staff' || role === 'viewer') setIsBackofficeUser(true);
      else setIsBackofficeUser(false);
    }
  }, [role]);

  // return
  return { role, isBackofficeUser, refreshUserToken };
};
