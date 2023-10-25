import { AdminRole, PlatformAccess, UserPermissions } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { usePlatformAccess } from 'app/api/platform/usePlatformAccess';
import { User } from 'firebase/auth';
import React from 'react';
import { useContextAppRequests } from '../requests/context';
import { AppAbility } from './types';
import { defineUserAbility } from './userAbility';

interface FirebaseUserContextProps {
  user?: User | null;
  platformAccess?: PlatformAccess;
  minVersion?: string | null;
  adminRole?: AdminRole | null;
  backofficePermissions?: UserPermissions | null;
  adminPermissions?: UserPermissions;
  isBackofficeSuperuser?: boolean | null;
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
  const { dispatchAppRequestResult } = useContextAppRequests();
  // states
  const [adminRole, setAdminRole] = React.useState<AdminRole | null>();
  const [backofficePermissions, setBackofficePermissions] =
    React.useState<UserPermissions | null>();
  const [userAbility, setUserAbility] = React.useState<AppAbility>();
  const [isBackofficeSuperuser, setIsBackofficeSuperuser] = React.useState<
    boolean | null
  >();
  const platformAccess = usePlatformAccess(typeof user?.uid === 'string');
  // helpers
  const minVersion = platformAccess?.minVersions.businessWeb;
  // handlers
  const refreshUserToken = React.useCallback(
    async (businessId?: string) => {
      if (user === undefined) return;
      if (user === null) {
        setAdminRole(null);
        setBackofficePermissions(null);
        return;
      }
      try {
        const token = await user.getIdTokenResult(true);
        const claims: { [key: string]: any } = token.claims ?? {};
        if (Object.keys(claims).includes('permissions')) {
          setBackofficePermissions(claims.permissions as UserPermissions);
        } else if (businessId) {
          const role = claims.businesses
            ? (claims.businesses[businessId] as AdminRole)
            : null;
          if (!role) {
            // error
            console.error(
              'refreshUserToken: Não foi possível encontrar as permissões do usuário.'
            );
          }
          setAdminRole(role ?? 'collaborator');
        }
      } catch (error) {
        console.log('%crefreshUserToken error:', 'color: red', error);
        Sentry.captureException(error);
      }
    },
    [user]
  );
  const handleUserAbility = React.useCallback(
    (permissions: UserPermissions | AdminRole, userId?: string) => {
      try {
        const ability = defineUserAbility(permissions, userId);
        return ability;
      } catch (error) {
        dispatchAppRequestResult({
          requestId: 'define-ability-error',
          status: 'error',
          error,
          message: {
            title: 'Erro:',
            description: 'Erro ao definir as permissões do usuário',
          },
        });
      }
    },
    [dispatchAppRequestResult]
  );
  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [refreshUserToken]);
  React.useEffect(() => {
    if (!user?.uid) return;
    if (!backofficePermissions) return;
    const ability = handleUserAbility(backofficePermissions, user.uid);
    setUserAbility(ability);
    // there is no practical need for backoffice users to create orders. So
    // we use the permission to 'create' 'orders' as superuser characteristic
    setIsBackofficeSuperuser(ability?.can('create', 'orders'));
  }, [user?.uid, backofficePermissions, handleUserAbility]);
  React.useEffect(() => {
    if (!adminRole) return;
    const ability = handleUserAbility(adminRole);
    setUserAbility(ability);
  }, [adminRole, handleUserAbility]);
  // provider
  return (
    <FirebaseUserContext.Provider
      value={{
        user,
        platformAccess,
        minVersion,
        adminRole,
        backofficePermissions,
        isBackofficeSuperuser,
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
