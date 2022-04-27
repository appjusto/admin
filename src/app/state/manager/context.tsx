import { Business, ManagerProfile, WithId } from '@appjusto/types';
import { useManagerBusinesses } from 'app/api/manager/useManagerBusinesses';
import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import React, { Dispatch, SetStateAction } from 'react';

interface ProfileContextProps {
  manager?: WithId<ManagerProfile> | null;
  setManagerEmail: Dispatch<SetStateAction<string | null | undefined>>;
  managerBusinesses?: WithId<Business>[] | null;
}

const ProfileContext = React.createContext<ProfileContextProps>({} as ProfileContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ManagerProvider = ({ children }: Props) => {
  const { manager, setManagerEmail } = useManagerProfile();
  const managerBusinesses = useManagerBusinesses(manager?.email);
  return (
    <ProfileContext.Provider value={{ manager, setManagerEmail, managerBusinesses }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
