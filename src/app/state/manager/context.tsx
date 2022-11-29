import { ManagerProfile, WithId } from '@appjusto/types';
import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import React, { Dispatch, SetStateAction } from 'react';
import { UseMutateFunction } from 'react-query';
import packageInfo from '../../../../package.json';
import { useContextFirebaseUser } from '../auth/context';
// import { useContextBusiness } from '../business/context';

const version = packageInfo.version;

let updateUserAgentCalls = 0;
let updateVersionCalls = 0;

interface ProfileContextProps {
  manager?: WithId<ManagerProfile> | null;
  setManagerEmail: Dispatch<SetStateAction<string | null | undefined>>;
  updateLastBusinessId: UseMutateFunction<
    void,
    unknown,
    string | null,
    unknown
  >;
}

const ProfileContext = React.createContext<ProfileContextProps>(
  {} as ProfileContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ManagerProvider = ({ children }: Props) => {
  // context
  const { user, isBackofficeUser } = useContextFirebaseUser();
  // const { setBusinessId } = useContextBusiness();
  const { manager, setManagerEmail } = useManagerProfile();
  // set useUpdateManagerProfile isOnboarding to "true" to avoid dispatching update
  // manager webAppVersion changes results
  const { updateProfile, updateLastBusinessId } = useUpdateManagerProfile(
    manager?.id,
    true
  );
  // update business context with manager last business id
  // React.useEffect(() => {
  //   if (isBackofficeUser) return;
  //   if (!manager?.lastBusinessId) return;
  //   setBusinessId(manager.lastBusinessId);
  // }, [isBackofficeUser, manager?.lastBusinessId, setBusinessId]);
  React.useEffect(() => {
    if (updateVersionCalls > 0) return;
    if (!user || !manager?.id) return;
    if (user.uid !== manager.id) return;
    if (!version || manager?.webAppVersion === version) return;
    updateVersionCalls++;
    updateProfile({ changes: { webAppVersion: version } });
  }, [user, manager?.id, manager?.webAppVersion, updateProfile]);
  React.useEffect(() => {
    if (updateUserAgentCalls > 0) return;
    if (!manager) return;
    if (isBackofficeUser !== false) return;
    const userAgent = window?.navigator?.userAgent;
    if (!userAgent || manager.userAgent === userAgent) return;
    updateUserAgentCalls++;
    updateProfile({ changes: { userAgent } });
  }, [isBackofficeUser, manager, updateProfile]);
  // UI
  return (
    <ProfileContext.Provider
      value={{ manager, setManagerEmail, updateLastBusinessId }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
