import { Role } from 'appjusto-types';
import React from 'react';
import { useFirebaseUser } from './useFirebaseUser';

const backofficeRoles: Role[] = ['owner', 'staff', 'viewer'];

export const useFirebaseUserRole = () => {
  // contex
  const user = useFirebaseUser();

  // state
  const [role, setRole] = React.useState<Role | null>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>(null);

  // handlers
  const refreshUserToken = React.useCallback(async () => {
    if (!user) {
      setRole(null);
      return;
    }
    try {
      const token = await user.getIdTokenResult(true);
      setRole(token?.claims.role ?? null);
    } catch (error) {
      console.dir('role_error', error);
    }
  }, [user]);

  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [refreshUserToken]);

  React.useEffect(() => {
    setIsBackofficeUser(!!role && backofficeRoles.indexOf(role) !== -1);
  }, [role]);

  // return
  return { role, isBackofficeUser, refreshUserToken };
};
