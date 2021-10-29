import { useContextApi } from 'app/state/api/context';
import { User, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useObserveUser = (userId: string) => {
  // context
  const api = useContextApi();
  // state
  const [user, setUser] = React.useState<WithId<User> | null>();
  // mutations
  const [updateUser, updateResult] = useMutation(async (changes: Partial<User>) => {
    await api.users().updateUser(userId!, changes);
  });
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUser(userId, setUser);
    return () => unsub();
  }, [api, userId]);
  // return
  return { user, updateUser, updateResult };
};
