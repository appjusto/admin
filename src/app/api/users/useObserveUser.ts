import { User, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { WithAuthId } from './UsersApi';

export const useObserveUser = (userId: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('users');
  // state
  const [user, setUser] = React.useState<WithAuthId<WithId<User>> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    const unsub = api.users().observeUser(userId, setUser);
    return () => unsub();
  }, [api, userCanRead, userId]);
  // return
  return user;
};
