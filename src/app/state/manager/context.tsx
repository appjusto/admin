import { useManagerBusinesses } from 'app/api/manager/useManagerBusinesses';
import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { Business, ManagerProfile, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useContextFirebaseUser } from '../auth/context';

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
  const { role } = useContextFirebaseUser();
  const { manager, setManagerEmail } = useManagerProfile();
  const managerBusinesses = useManagerBusinesses(manager?.email, role);
  return (
    <ProfileContext.Provider value={{ manager, setManagerEmail, managerBusinesses }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
