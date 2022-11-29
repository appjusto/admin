import { ConsumerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveConsumerProfile = (
  consumerId: string | undefined | null
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('consumers');
  // state
  const [profile, setProfile] = React.useState<
    WithId<ConsumerProfile> | undefined | null
  >(null);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (consumerId === undefined) return; // during initialization
    if (consumerId === null) {
      // no consumer
      setProfile(null);
      return;
    }
    const unsub = api.consumer().observeConsumerProfile(consumerId, setProfile);
    return () => unsub();
  }, [api, userCanRead, consumerId]);
  // return
  return profile;
};
