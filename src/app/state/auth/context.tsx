import { BackofficePermissions } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { User } from 'firebase/auth';
import React from 'react';

export type GeneralRoles =
  | 'owner'
  | 'staff'
  | 'viewer'
  | 'courier-manager'
  | 'manager'
  | 'collaborator';

type AdminRole = 'manager' | 'collaborator';

export const adminRoles: GeneralRoles[] = ['manager', 'collaborator'];
export const backofficeRoles: GeneralRoles[] = ['owner', 'staff', 'viewer', 'courier-manager'];

interface FirebaseUserContextProps {
  user?: User | null;
  role?: GeneralRoles | null;
  backofficePermissions?: BackofficePermissions;
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
  const [backofficePermissions, setBackofficePermissions] = React.useState<BackofficePermissions>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>();
  // handlers
  const refreshUserToken = React.useCallback(
    async (businessId?: string) => {
      if (user === undefined) return;
      if (user === null) {
        setRole(null);
        setIsBackofficeUser(null);
        return;
      }
      try {
        const token = await user.getIdTokenResult(true);
        if (Object.keys(token?.claims).includes('role')) setRole(token.claims.role as GeneralRoles);
        if (Object.keys(token?.claims).includes('permissions'))
          setBackofficePermissions(token.claims.permissions as BackofficePermissions);
        else if (businessId) {
          const userRole = token.claims[businessId] as AdminRole | undefined;
          setRole(userRole ?? null);
          setIsBackofficeUser(false);
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
    if (role) {
      if (adminRoles.includes(role)) setIsBackofficeUser(false);
      else if (backofficeRoles.includes(role)) setIsBackofficeUser(true);
    }
    if (backofficePermissions) setIsBackofficeUser(true);
  }, [role, backofficePermissions]);
  // provider
  return (
    <FirebaseUserContext.Provider
      value={{ user, role, isBackofficeUser, backofficePermissions, refreshUserToken }}
    >
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
