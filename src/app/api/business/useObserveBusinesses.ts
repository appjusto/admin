import { useContextApi } from 'app/state/api/context';
import { Business, WithId } from '@appjusto/types';
import React from 'react';
import firebase from 'firebase/app';
import { uniqWith, isEqual } from 'lodash';

export const useObserveBusinesses = (situations: string[]) => {
  // context
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastBusiness, setLastBusiness] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastBusiness);
  }, [lastBusiness]);
  // side effects
  React.useEffect(() => {
    const unsub = api.business().observeBusinesses(
      (results, last) => {
        if (!startAfter) setBusinesses(results);
        else
          setBusinesses((prev) => {
            if (prev) {
              const union = [...prev, ...results];
              return uniqWith(union, isEqual);
            }
            return results;
          });
        if (last) setLastBusiness(last);
      },
      situations,
      startAfter
    );
    return () => unsub();
  }, [api, situations, startAfter]);
  // return
  return { businesses, fetchNextPage };
};
