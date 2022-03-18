import { Business, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { isEqual, uniqWith } from 'lodash';
import React from 'react';

export const useObserveBusinesses = (situations: string[]) => {
  // context
  const api = useContextApi();
  // state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);
  const [startAfter, setStartAfter] = React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastBusiness, setLastBusiness] = React.useState<QueryDocumentSnapshot<DocumentData>>();
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
