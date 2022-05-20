import { User, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { WithAuthId } from './UsersApi';

export const useObserveUser = (userId: string) => {
  // context
  const api = useContextApi();
  // state
  const [user, setUser] = React.useState<WithAuthId<WithId<User>> | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUser(userId, setUser);
    return () => unsub();
  }, [api, userId]);
  // return
  return user;
};
