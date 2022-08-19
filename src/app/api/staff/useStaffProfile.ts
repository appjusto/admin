import { StaffProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useStaffProfile = () => {
  // contex
  const api = useContextApi();
  const { user, isBackofficeUser } = useContextFirebaseUser();
  // state
  const [profile, setProfile] = React.useState<
    WithId<StaffProfile> | undefined | null
  >();
  // side effects
  // observe profile
  React.useEffect(() => {
    if (!user?.uid || !isBackofficeUser) return;
    const unsub = api.staff().observeProfile(user.uid, setProfile);
    return () => unsub();
  }, [api, user?.uid, isBackofficeUser]);
  React.useEffect(() => {
    if (!user?.uid || !isBackofficeUser) return;
    if (profile?.situation === 'pending') {
      api.staff().updateProfile(user.uid, { situation: 'approved' });
    }
  }, [api, user?.uid, isBackofficeUser, profile]);
  // return
  return profile;
};
