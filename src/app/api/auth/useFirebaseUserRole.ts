import React from 'react';
import { useFirebaseUser } from './useFirebaseUser';

export const useFirebaseUserRole = () => {
  // contex
  const user = useFirebaseUser();

  // state
  const [role, setRole] = React.useState<string | null>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>(null);

  // handlers
  const refreshUserToken = React.useCallback(async () => {
    console.log('RefreshUserToken');
    if (!user) return;
    try {
      const token = await user.getIdTokenResult();
      console.log('token', token);
      setRole(token?.claims.role ?? null);
    } catch (error) {
      console.dir('role_error', error);
    }
  }, [user]);

  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [refreshUserToken, user]);

  React.useEffect(() => {
    if (role) {
      if (role === 'owner' || role === 'staff' || role === 'viewer') setIsBackofficeUser(true);
      else setIsBackofficeUser(false);
    }
  }, [role]);

  // return
  return { role, isBackofficeUser, refreshUserToken };
};
