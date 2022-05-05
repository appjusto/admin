import { AdminRole, PlatformAccess, UserPermissions } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { usePlatformAccess } from 'app/api/platform/usePlatformAccess';
import { User } from 'firebase/auth';
import React from 'react';
import { AppAbility, defineUserAbility } from './userAbility';

interface FirebaseUserContextProps {
  user?: User | null;
  platformAccess?: PlatformAccess;
  minVersion?: string | null;
  adminRole?: AdminRole | null;
  backofficePermissions?: UserPermissions;
  adminPermissions?: UserPermissions;
  isBackofficeUser?: boolean | null;
  userAbility?: AppAbility;
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
  const [adminRole, setAdminRole] = React.useState<AdminRole | null>();
  const [backofficePermissions, setBackofficePermissions] = React.useState<UserPermissions>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>();
  const [userAbility, setUserAbility] = React.useState<AppAbility>();
  const platformAccess = usePlatformAccess(typeof user?.uid === 'string');
  // helpers
  const minVersion = platformAccess?.minVersions.businessWeb;
  // handlers
  const refreshUserToken = React.useCallback(
    async (businessId?: string) => {
      if (user === undefined) return;
      if (user === null) {
        setAdminRole(null);
        setIsBackofficeUser(null);
        return;
      }
      try {
        const token = await user.getIdTokenResult(true);
        const claims: { [key: string]: any } = token.claims ?? {};
        if (Object.keys(claims).includes('permissions')) {
          setBackofficePermissions(claims.permissions as UserPermissions);
        } else if (businessId) {
          const role = claims.businesses[businessId] as AdminRole;
          if (!role) {
            // error
            console.error('refreshUserToken: Não foi possível encontrar as permissões do usuário.');
            return;
          }
          setAdminRole(role ?? null);
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
    if (!backofficePermissions) return;
    const ability = defineUserAbility(backofficePermissions);
    setUserAbility(ability);
    setIsBackofficeUser(true);
  }, [backofficePermissions]);
  React.useEffect(() => {
    if (!adminRole) return;
    const ability = defineUserAbility(adminRole);
    setUserAbility(ability);
    setIsBackofficeUser(false);
  }, [adminRole]);
  // provider
  return (
    <FirebaseUserContext.Provider
      value={{
        user,
        platformAccess,
        minVersion,
        adminRole,
        backofficePermissions,
        isBackofficeUser,
        userAbility,
        refreshUserToken,
      }}
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
