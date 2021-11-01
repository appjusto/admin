import { useContextApi } from 'app/state/api/context';
import { ProfileChange, WithId } from 'appjusto-types';
import React from 'react';

export type ProfileChangesSituations = 'pending' | 'approved' | 'rejected';

export const useObserveUsersChanges = (situations: ProfileChangesSituations[]) => {
  // context
  const api = useContextApi();
  // state
  const [changes, setChanges] = React.useState<WithId<ProfileChange>[]>([]);
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUsersChanges(situations, setChanges);
    return () => unsub();
  }, [api, situations]);
  // return
  return changes;
};
