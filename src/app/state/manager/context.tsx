import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

const ProfileContext = React.createContext<WithId<ManagerProfile> | undefined | null>(undefined);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ManagerProvider = ({ children }: Props) => {
  const profile = useManagerProfile();
  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
