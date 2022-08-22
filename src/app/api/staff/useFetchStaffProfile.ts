import { StaffProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useFetchStaffProfile = (staffId: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('staff');
  // state
  const [profile, setProfile] = React.useState<WithId<StaffProfile> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!staffId) return;
    (async () => {
      const data = await api.staff().fetchStaffProfile(staffId);
      setProfile(data);
    })();
  }, [api, userCanRead, staffId]);
  // return
  return profile;
};
