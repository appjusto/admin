import { useContextApi } from 'app/state/api/context';
import { ConsumerProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useConsumerProfile = (consumerId: string | undefined | null) => {
  // context
  const api = useContextApi();
  // state
  const [profile, setProfile] = React.useState<WithId<ConsumerProfile> | undefined | null>(null);
  // side effects
  // side effects
  React.useEffect(() => {
    if (consumerId === undefined) return; // during initialization
    if (consumerId === null) {
      // no consumer
      setProfile(null);
      return;
    }
    return api.consumer().observeConsumerProfile(consumerId, setProfile);
  }, [api, consumerId]);

  // return
  return profile;
};
