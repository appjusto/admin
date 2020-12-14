import { useApi } from 'app/state/api/context';
import { useContextFirebaseUserEmail, useContextFirebaseUserId } from 'app/state/auth/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useManagerProfile = () => {
  // contex
  const api = useApi();
  const id = useContextFirebaseUserId();
  const email = useContextFirebaseUserEmail();

  // state
  const [profile, setProfile] = React.useState<WithId<ManagerProfile> | undefined | null>();
  
  // side effects
  // observe profile
  React.useEffect(() => {
    if (!id) return;
    return api.manager().observeProfile(id, setProfile);
  }, [id, api]);
  // create profile if it doesn't exist
  React.useEffect(() => {
    if (!id || !email) return;
    if (profile === null) {
      api.manager().createProfile(id, email);
    }
  }, [id, email, profile, api]);

  // return
  return profile;
};
