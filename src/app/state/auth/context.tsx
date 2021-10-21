import * as Sentry from '@sentry/react';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import firebase from 'firebase/app';
import React from 'react';

export type GeneralRoles =
  | 'owner'
  | 'staff'
  | 'viewer'
  | 'courier-manager'
  | 'manager'
  | 'collaborator';

type AdminRole = 'manager' | 'collaborator';

export const backofficeRoles: GeneralRoles[] = ['owner', 'staff', 'viewer', 'courier-manager'];

interface FirebaseUserContextProps {
  user?: firebase.User | null;
  role?: GeneralRoles | null;
  isBackofficeUser?: boolean | null;
  refreshUserToken?(businessId?: string): Promise<void>;
}

const FirebaseUserContext = React.createContext<FirebaseUserContextProps>({});
interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const FirebaseUserProvider = ({ children }: Props) => {
  // context
  const user = useFirebaseUser();
  // states
  const [role, setRole] = React.useState<GeneralRoles | null>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>();
  // handlers
  const refreshUserToken = React.useCallback(
    async (businessId?: string) => {
      if (!user) {
        setRole(null);
        return;
      }
      try {
        const token = await user.getIdTokenResult(true);
        if (Object.keys(token?.claims).includes('role')) setRole(token?.claims.role);
        else if (businessId) {
          const userRole = token.claims[businessId] as AdminRole | undefined;
          setRole(userRole ?? null);
        }
      } catch (error) {
        console.dir('role_error', error);
        Sentry.captureException(error);
      }
    },
    [user]
  );
  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [refreshUserToken]);
  React.useEffect(() => {
    if (role === undefined) return;
    if (role === null) {
      setIsBackofficeUser(null);
      return;
    }
    setIsBackofficeUser(backofficeRoles.indexOf(role) !== -1);
  }, [role]);
  console.log('role', role);
  console.log('isBackofficeUser', isBackofficeUser);
  // provider
  return (
    <FirebaseUserContext.Provider value={{ user, role, isBackofficeUser, refreshUserToken }}>
      {children}
    </FirebaseUserContext.Provider>
  );
};

export const useContextFirebaseUser = () => {
  return React.useContext(FirebaseUserContext);
};

export const useContextFirebaseUserId = () => {
  const { user } = useContextFirebaseUser();
  return user?.uid;
};

export const useContextFirebaseUserEmail = () => {
  const { user } = useContextFirebaseUser();
  return user?.email;
};
