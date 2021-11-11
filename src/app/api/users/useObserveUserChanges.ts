import { useContextApi } from 'app/state/api/context';
import { ProfileChange, WithId } from 'appjusto-types';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveUserChanges = (changesId: string) => {
  // context
  const api = useContextApi();
  // state
  const [changes, setChanges] = React.useState<WithId<ProfileChange> | null>();
  // mutations
  const { mutateAsync: updateChange, mutationResult: updateChangeResult } = useCustomMutation(
    async (changes: Partial<ProfileChange>) => {
      await api.users().updateChanges(changesId!, changes);
    }
  );
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUserChange(changesId, setChanges);
    return () => unsub();
  }, [api, changesId]);
  // return
  return { changes, updateChange, updateChangeResult };
};
