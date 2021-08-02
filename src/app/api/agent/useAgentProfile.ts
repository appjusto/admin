import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useAgentProfile = () => {
  // contex
  const api = useContextApi();
  const { user, isBackofficeUser } = useContextFirebaseUser();
  // state
  const [profile, setProfile] = React.useState<WithId<ManagerProfile> | undefined | null>();
  // side effects
  // observe profile
  React.useEffect(() => {
    if (!user?.uid || !isBackofficeUser) return;
    const unsub = api.manager().observeProfile(user.uid, setProfile);
    return () => unsub();
  }, [api, user?.uid, isBackofficeUser]);
  // return
  return profile;
};
