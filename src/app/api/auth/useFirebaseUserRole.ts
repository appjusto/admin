import React from 'react';
import { useFirebaseUser } from './useFirebaseUser';

export const useFirebaseUserRole = () => {
  // contex
  const user = useFirebaseUser();

  // state
  const [role, setRole] = React.useState<string | undefined | null>(undefined);
  const [isStaff, setIsStaff] = React.useState<boolean | null>(null);

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
      if (role === 'owner' || role === 'staff' || role === 'viewer') setIsStaff(true);
      else setIsStaff(false);
    }
  }, [role]);

  // return
  return { role, isStaff };
};
