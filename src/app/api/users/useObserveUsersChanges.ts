import { useContextApi } from 'app/state/api/context';
import { ProfileChange, WithId } from 'appjusto-types';
import React from 'react';
import { uniqWith, isEqual } from 'lodash';
import firebase from 'firebase/app';

export type ProfileChangesSituations = 'pending' | 'approved' | 'rejected';

export const useObserveUsersChanges = (situations: ProfileChangesSituations[]) => {
  // context
  const api = useContextApi();
  // state
  const [userChanges, setUserChanges] = React.useState<WithId<ProfileChange>[]>([]);
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastChange, setLastChange] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
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
