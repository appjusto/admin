import { CourierProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useCourierProfile = (courierId: string | undefined | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('couriers');
  // state
  const [profile, setProfile] = React.useState<
    WithId<CourierProfile> | undefined | null
  >(null);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (courierId === undefined) return; // during initialization
    if (courierId === null) {
      // no business
      setProfile(null);
      return;
    }
    const unsub = api.courier().observeCourierProfile(courierId, setProfile);
    return () => unsub();
  }, [api, userCanRead, courierId]);
  // return
  return profile;
};
