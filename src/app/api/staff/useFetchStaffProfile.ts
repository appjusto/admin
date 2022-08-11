import { StaffProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useFetchStaffProfile = (staffId: string) => {
  // context
  const api = useContextApi();
  // state
  const [profile, setProfile] = React.useState<WithId<StaffProfile> | null>();
  // side effects
  React.useEffect(() => {
    if (!staffId) return;
    (async () => {
      const data = await api.staff().fetchStaffProfile(staffId);
      setProfile(data);
    })();
  }, [api, staffId]);
  // return
  return profile;
};
