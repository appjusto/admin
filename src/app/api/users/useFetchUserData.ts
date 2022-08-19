import { UserProfile, UserType, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useFetchUserData = (accountId?: string, userType?: UserType) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('users');
  // state
  const [userData, setUserData] = React.useState<WithId<UserProfile> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!accountId || !userType) return;
    (async () => {
      const data = await api.users().fetchUserData(accountId, userType);
      setUserData(data);
    })();
  }, [api, userCanRead, accountId, userType]);
  // return
  return userData;
};
