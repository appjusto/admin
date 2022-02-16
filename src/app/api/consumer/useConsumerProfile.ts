import { useContextApi } from 'app/state/api/context';
import { ConsumerProfile, WithId } from '@appjusto/types';
import React from 'react';

export const useConsumerProfile = (consumerId: string | undefined | null) => {
  // context
  const api = useContextApi();
  // state
  const [profile, setProfile] = React.useState<WithId<ConsumerProfile> | undefined | null>(null);
  // side effects
  React.useEffect(() => {
    if (consumerId === undefined) return; // during initialization
    if (consumerId === null) {
      // no consumer
      setProfile(null);
      return;
    }
    const unsub = api.consumer().observeConsumerProfile(consumerId, setProfile);
    return () => unsub();
  }, [api, consumerId]);
  // return
  return profile;
};
