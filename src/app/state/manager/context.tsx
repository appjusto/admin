import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { ManagerProfile, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';

interface ProfileContextProps {
  manager: WithId<ManagerProfile> | undefined | null;
  setManagerEmail: Dispatch<SetStateAction<string | null | undefined>>;
}

const ProfileContext = React.createContext<ProfileContextProps>({} as ProfileContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ManagerProvider = ({ children }: Props) => {
  const { manager, setManagerEmail } = useManagerProfile();
  return (
    <ProfileContext.Provider value={{ manager, setManagerEmail }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
