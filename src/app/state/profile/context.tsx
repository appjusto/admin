import { useApi } from 'app/api/context';
import { BusinessManagerProfile } from 'appjusto-types';
import React, { useEffect } from 'react';
import { useFirebaseUser } from '../user/context';

interface ProfileContextInterface {
  profile: BusinessManagerProfile | undefined | null;
  setProfile: React.Dispatch<React.SetStateAction<BusinessManagerProfile | undefined | null>>;
}

const ProfileContext = React.createContext<ProfileContextInterface | undefined>(undefined);

export const ProfileProvider = (
  props: Omit<React.ProviderProps<ProfileContextInterface>, 'value'>
) => {
  const user = useFirebaseUser();
  const api = useApi()!;
  const [profile, setProfile] = React.useState<BusinessManagerProfile | undefined | null>(
    undefined
  );
  const value: ProfileContextInterface = React.useMemo(() => ({ profile, setProfile }), [profile]);
  useEffect(() => {
    if (!user) return;
    return api.profile().observeProfile(user.uid, (profile) => {
      setProfile(profile);
    });
  }, [user, api]);

  return <ProfileContext.Provider value={value}>{props.children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  return React.useContext(ProfileContext)?.profile;
};
