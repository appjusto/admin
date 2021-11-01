import { useContextApi } from 'app/state/api/context';
import { ProfileChange, WithId } from 'appjusto-types';
import React from 'react';

export const useObserveUserChanges = (changesId: string) => {
  // context
  const api = useContextApi();
  // state
  const [changes, setChanges] = React.useState<WithId<ProfileChange> | null>();
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUserChange(changesId, setChanges);
    return () => unsub();
  }, [api, changesId]);
  // return
  return changes;
};
