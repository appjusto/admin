import { useContextApi } from 'app/state/api/context';
import { CourierProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useCourierProfile = (courierId: string | undefined | null) => {
  // context
  const api = useContextApi();
  // state
  const [profile, setProfile] = React.useState<WithId<CourierProfile> | undefined | null>(null);
  // side effects
  // side effects
  React.useEffect(() => {
    if (courierId === undefined) return; // during initialization
    if (courierId === null) {
      // no business
      setProfile(null);
      return;
    }
    return api.courier().observeCourierProfile(courierId, setProfile);
  }, [api, courierId]);

  // return
  return profile;
};
