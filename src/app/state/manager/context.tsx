import { ManagerProfile, WithId } from '@appjusto/types';
import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import React, { Dispatch, SetStateAction } from 'react';
import { UseMutateAsyncFunction } from 'react-query';
import packageInfo from '../../../../package.json';
import { useContextFirebaseUser } from '../auth/context';
import { useContextBusiness } from '../business/context';

const version = packageInfo.version;

interface ProfileContextProps {
  manager?: WithId<ManagerProfile> | null;
  setManagerEmail: Dispatch<SetStateAction<string | null | undefined>>;
  updateLastBusinessId: UseMutateAsyncFunction<void, unknown, string, unknown>;
}

const ProfileContext = React.createContext<ProfileContextProps>({} as ProfileContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ManagerProvider = ({ children }: Props) => {
  // context
  const { user } = useContextFirebaseUser();
  const { setBusinessId } = useContextBusiness();
  const { manager, setManagerEmail } = useManagerProfile();
  // set useUpdateManagerProfile isOnboarding to "true" to avoid dispatching update
  // manager appVersion changes results
  const { updateProfile, updateLastBusinessId } = useUpdateManagerProfile(manager?.id, true);
  // update business context with manager last business id
  React.useEffect(() => {
    if (!manager?.lastBusinessId) return;
    setBusinessId(manager.lastBusinessId);
  }, [manager?.lastBusinessId, setBusinessId]);
  React.useEffect(() => {
    if (!user || !manager?.id) return;
    if (user.uid !== manager.id) return;
    if (!version || manager?.appVersion === version) return;
    console.log('Update manager appVersion');
    updateProfile({ changes: { appVersion: version } });
  }, [user, manager?.id, manager?.appVersion, updateProfile]);
  // UI
  return (
    <ProfileContext.Provider value={{ manager, setManagerEmail, updateLastBusinessId }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
