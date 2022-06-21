import { ProfileChange, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveUserChanges = (changesId: string) => {
  // context
  const api = useContextApi();
  // state
  const [changes, setChanges] = React.useState<WithId<ProfileChange> | null>();
  // mutations
  const { mutate: updateChange, mutationResult: updateChangeResult } = useCustomMutation(
    (changes: Partial<ProfileChange>) => api.users().updateChanges(changesId!, changes),
    'updateUserChange'
  );
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUserChange(changesId, setChanges);
    return () => unsub();
  }, [api, changesId]);
  // return
  return { changes, updateChange, updateChangeResult };
};
