import { useApi } from 'app/state/api/context';
import { BusinessManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useManagerProfile = (managerId?: string) => {
  // contex
  const api = useApi();

  // state
  const [profile, setProfile] = React.useState<WithId<BusinessManagerProfile> | undefined>();

  // side effects
  React.useEffect(() => {
    if (!managerId) return;
    return api.manager().observeProfile(managerId, setProfile);
  }, [api, managerId]);

  // return
  return profile;
};
