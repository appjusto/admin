import { useContextApi } from 'app/state/api/context';
import { User, WithId } from 'appjusto-types';
import React from 'react';

export const useObserveUser = (userId: string) => {
  // context
  const api = useContextApi();
  // state
  const [user, setUser] = React.useState<WithId<User> | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUser(userId, setUser);
    return () => unsub();
  }, [api, userId]);
  // return
  return user;
};
