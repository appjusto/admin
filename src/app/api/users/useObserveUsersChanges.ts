import { ProfileChange, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { isEqual, uniqWith } from 'lodash';
import React from 'react';

export type ProfileChangesSituations = 'pending' | 'approved' | 'rejected';

export const useObserveUsersChanges = (situations: ProfileChangesSituations[]) => {
  // context
  const api = useContextApi();
  // state
  const [userChanges, setUserChanges] = React.useState<WithId<ProfileChange>[]>([]);
  const [startAfter, setStartAfter] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastChange, setLastChange] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastChange);
  }, [lastChange]);
  // side effects
  React.useEffect(() => {
    const unsub = api.users().observeUsersChanges(
      (results, last) => {
        if (!startAfter) setUserChanges(results);
        else
          setUserChanges((prev) => {
            if (prev) {
              const union = [...prev, ...results];
              return uniqWith(union, isEqual);
            }
            return results;
          });
        if (last) setLastChange(last);
      },
      situations,
      startAfter
    );
    return () => unsub();
  }, [api, situations, startAfter]);
  // return
  return { userChanges, fetchNextPage };
};
