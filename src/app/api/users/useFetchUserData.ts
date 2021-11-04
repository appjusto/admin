import { useContextApi } from 'app/state/api/context';
import { UserProfile, UserType, WithId } from 'appjusto-types';
import React from 'react';

export const useFetchUserData = (accountId?: string, userType?: UserType) => {
  // context
  const api = useContextApi();
  // state
  const [userData, setUserData] = React.useState<WithId<UserProfile> | null>();
  // side effects
  React.useEffect(() => {
    if (!accountId || !userType) return;
    (async () => {
      const data = await api.users().fetchUserData(accountId, userType);
      setUserData(data);
    })();
  }, [api, accountId, userType]);
  // return
  return userData;
};
