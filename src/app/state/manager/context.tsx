import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { BusinessManagerProfile } from 'appjusto-types';
import React from 'react';
import { useContextFirebaseUser } from '../user/context';

const ProfileContext = React.createContext<BusinessManagerProfile | undefined>(undefined);

export const ManagerProvider = (
  props: Omit<React.ProviderProps<BusinessManagerProfile>, 'value'>
) => {
  // user undefined while firebase initializes
  const user = useContextFirebaseUser();
  const profile = useManagerProfile(user?.uid);

  return <ProfileContext.Provider value={profile}>{props.children}</ProfileContext.Provider>;
};

export const useContextManagerProfile = () => {
  return React.useContext(ProfileContext);
};
