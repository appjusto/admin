import { ManagerProfile, WithId } from '@appjusto/types';
import { isElectron } from '@firebase/util';
import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import React, { Dispatch, SetStateAction } from 'react';
import { UseMutateFunction } from 'react-query';
import packageInfo from '../../../../package.json';
import { useContextFirebaseUser } from '../auth/context';

const version = packageInfo.version;

const isDesktopApp = isElectron();

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
  const { manager, setManagerEmail } = useManagerProfile();
  // set useUpdateManagerProfile isOnboarding to "true" to avoid dispatching update
  // manager webAppVersion changes results
  const { updateProfile, updateLastBusinessId } = useUpdateManagerProfile(
    manager?.id,
    true
  );
  // side effects
  React.useEffect(() => {
    if (updateVersionCalls > 0) return;
    if (!version) return;
    if (!user || !manager?.id) return;
    if (user.uid !== manager.id) return;
    updateVersionCalls++;
    console.log('LOGGG!!!');
    if (isDesktopApp && manager?.desktopAppVersion !== version) {
      updateProfile({ changes: { desktopAppVersion: version } });
    } else if (manager?.webAppVersion !== version) {
      updateProfile({ changes: { webAppVersion: version } });
    }
  }, [
    user,
    manager?.id,
    manager?.webAppVersion,
    manager?.desktopAppVersion,
    updateProfile,
  ]);
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
