import { ConsumerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useConsumerProfile = (consumerId?: string | null) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('consumers');
  // state
  const [profile, setProfile] =
    React.useState<WithId<ConsumerProfile> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!consumerId) return;
    (async () => {
      const consumer = await api.consumer().getConsumerById(consumerId);
      setProfile(consumer);
    })();
  }, [api, userCanRead, consumerId]);
  // return
  return profile;
};
