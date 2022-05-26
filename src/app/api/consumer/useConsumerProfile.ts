import { ConsumerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useConsumerProfile = (consumerId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [profile, setProfile] = React.useState<WithId<ConsumerProfile> | null>();
  // side effects
  React.useEffect(() => {
    if (!consumerId) return;
    (async () => {
      const consumer = await api.consumer().getConsumerById(consumerId);
      setProfile(consumer);
    })();
  }, [api, consumerId]);
  // return
  return profile;
};
