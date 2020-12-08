import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';

const ProfileContext = React.createContext<WithId<ManagerProfile> | undefined>(undefined);

export const ManagerProvider = (props: Omit<React.ProviderProps<ManagerProfile>, 'value'>) => {
  // user is undefined while firebase initializes
  const user = useContextFirebaseUser();
  const profile = useManagerProfile(user?.uid);

  return <ProfileContext.Provider value={profile}>{props.children}</ProfileContext.Provider>;
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
