import { UserPermissions } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { User } from 'firebase/auth';
import { getBusinessManagerBasicRole } from 'pages/team/utils';
import React from 'react';
import { AppAbility, defineAbilityFor } from './userAbility';

export type AdminRole = 'owner' | 'manager' | 'collaborator';

interface FirebaseUserContextProps {
  user?: User | null;
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
  const [adminPermissions, setAdminPermissions] = React.useState<UserPermissions>();
  const [backofficePermissions, setBackofficePermissions] = React.useState<UserPermissions>();
  const [isBackofficeUser, setIsBackofficeUser] = React.useState<boolean | null>();
  const [userAbility, setUserAbility] = React.useState<AppAbility>();
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
        // if (Object.keys(token?.claims).includes('role')) setRole(token.claims.role as GeneralRoles);
        if (Object.keys(claims).includes('permissions')) {
          setBackofficePermissions(claims.permissions as UserPermissions);
          const ability = defineAbilityFor(claims.permissions);
          setUserAbility(ability);
        } else if (businessId) {
          const userPermissions = claims.businesses[businessId] as UserPermissions | undefined;
          if (!userPermissions) {
            // error
            console.error('refreshUserToken: Não foi possível encontrar as permissões do usuário.');
            return;
          }
          const ability = defineAbilityFor(userPermissions);
          const managerBasicRole = getBusinessManagerBasicRole(userPermissions);
          setAdminRole(managerBasicRole ?? null);
          setAdminPermissions(userPermissions);
          setIsBackofficeUser(false);
          setUserAbility(ability);
        }
      } catch (error) {
        console.dir('role_error', error);
        Sentry.captureException(error);
      }
    },
    [user, defineAbilityFor]
  );
  // side effects
  React.useEffect(() => {
    refreshUserToken();
  }, [refreshUserToken]);
  React.useEffect(() => {
    if (!backofficePermissions) return;
    setIsBackofficeUser(true);
  }, [backofficePermissions]);
  // provider
  return (
    <FirebaseUserContext.Provider
      value={{
        user,
        adminRole,
        backofficePermissions,
        adminPermissions,
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
