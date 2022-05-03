import { ManagerProfile, WithId } from '@appjusto/types';
import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { useUpdateManagerProfile } from 'app/api/manager/useUpdateManagerProfile';
import React, { Dispatch, SetStateAction } from 'react';
import { UseMutateAsyncFunction } from 'react-query';
import { useContextBusiness } from '../business/context';

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
  const { setBusinessId } = useContextBusiness();
  const { manager, setManagerEmail } = useManagerProfile();
  const { updateLastBusinessId } = useUpdateManagerProfile(manager?.id);
  // update business context with manager last business id
  React.useEffect(() => {
    if (!manager?.lastBusinessId) return;
    setBusinessId(manager.lastBusinessId);
  }, [manager?.lastBusinessId]);
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
