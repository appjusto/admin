import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useManagerProfile = () => {
  // contex
  const api = useContextApi();
  const user = useContextFirebaseUser();

  // state
  const [profile, setProfile] = React.useState<WithId<ManagerProfile> | undefined | null>();
  const [claims, setClaims] = React.useState<{ [key: string]: any }>();

  // side effects
  // observe profile
  React.useEffect(() => {
    if (!user) return;
    return api.manager().observeProfile(user.uid, setProfile);
  }, [user, api]);
  // create profile if it doesn't exist
  React.useEffect(() => {
    if (!user) return;
    if (profile === null) {
      api.manager().createProfile(user.uid, user.email!);
    }
  }, [user, profile, api]);
  // observe private platform
  React.useEffect(() => {
    if (!user) return;
    return api.manager().observePrivatePlatform(user.uid, async () => {
      setClaims((await user.getIdTokenResult()).claims);
    });
  }, [user, api]);

  // return
  // TODO: return claims
  return profile;
};
