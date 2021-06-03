import React from 'react';
import { useFirebaseUser } from './useFirebaseUser';
import * as Sentry from '@sentry/react';

export type GeneralRoles =
  | 'owner'
  | 'staff'
  | 'viewer'
  | 'courier-manager'
  | 'manager'
  | 'collaborator';

const backofficeRoles: GeneralRoles[] = ['owner', 'staff', 'viewer', 'courier-manager'];

export const useFirebaseUserRole = (businessId?: string) => {
  // contex
  const user = useFirebaseUser();

  // state
  const [role, setRole] = React.useState<GeneralRoles | null>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>(null);

  // handlers
  const refreshUserToken = React.useCallback(async () => {
    if (!user) {
      setRole(null);
      return;
    }
    try {
      const token = await user.getIdTokenResult(true);
      if (token?.claims.role) setRole(token?.claims.role);
      else if (businessId) setRole(token.claims[businessId]);
    } catch (error) {
      console.dir('role_error', error);
      Sentry.captureException(error);
    }
  }, [user, businessId]);

  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [refreshUserToken]);

  React.useEffect(() => {
    if (!role) return;
    setIsBackofficeUser(backofficeRoles.includes(role));
  }, [role]);

  // return
  return { role, isBackofficeUser, refreshUserToken };
};
