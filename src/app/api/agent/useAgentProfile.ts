import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUserId } from 'app/state/auth/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';
import { useFirebaseUserRole } from '../auth/useFirebaseUserRole';

export const useAgentProfile = () => {
  // contex
  const api = useContextApi();
  const id = useContextFirebaseUserId();
  const { isBackofficeUser } = useFirebaseUserRole();

  // state
  const [profile, setProfile] = React.useState<WithId<ManagerProfile> | undefined | null>();

  // side effects
  // observe profile
  React.useEffect(() => {
    if (isBackofficeUser && id) {
      return api.manager().observeProfile(id, setProfile);
    }
  }, [id, api, isBackofficeUser]);

  // return
  return profile;
};
