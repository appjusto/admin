import { useContextApi } from 'app/state/api/context';
import { UserProfile, WithId } from 'appjusto-types';
import React from 'react';
import { UserType } from './UsersApi';

export const useFetchUserData = (accountId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [userData, setUserData] = React.useState<WithId<UserProfile> | null>();
  const [userType, setUserType] = React.useState<UserType | null>();
  // side effects
  React.useEffect(() => {
    if (!accountId) return;
    (async () => {
      const { data, type } = await api.users().fetchUserData(accountId);
      setUserData(data);
      setUserType(type);
    })();
  }, [api, accountId]);
  // return
  return { userData, userType };
};
