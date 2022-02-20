import { useContextApi } from 'app/state/api/context';
import { CourierProfile, WithId } from '@appjusto/types';
import React from 'react';

export const useCourierProfile = (courierId: string | undefined | null) => {
  // context
  const api = useContextApi();
  // state
  const [profile, setProfile] = React.useState<WithId<CourierProfile> | undefined | null>(null);
  // side effects
  React.useEffect(() => {
    if (courierId === undefined) return; // during initialization
    if (courierId === null) {
      // no business
      setProfile(null);
      return;
    }
    const unsub = api.courier().observeCourierProfile(courierId, setProfile);
    return () => unsub();
  }, [api, courierId]);
  // return
  return profile;
};
