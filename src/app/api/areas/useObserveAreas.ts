import { Area, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';

const initialMap = new Map();

export const useObserveAreas = (state?: string, city?: string) => {
  // context
  const api = useContextApi();
  // state
  const [areasMap, setAreasMap] =
    React.useState<Map<string | undefined, WithId<Area>[]>>(initialMap);
  const [areas, setAreas] = React.useState<WithId<Area>[]>([]);
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastUser, setLastUser] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastUser);
  }, [lastUser]);
  // side effects
  // React.useEffect(() => {
  //   if (state || city) return;
  //   setAreasMap(initialMap);
  //   setStartAfter(undefined);
  // }, [state, city]);
  React.useEffect(() => {
    if (!api) return;
    const unsub = api.areas().observeAreas(
      (results, last) => {
        setAreasMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastUser(last);
      },
      state,
      city,
      startAfter
    );
    return () => unsub();
  }, [api, state, city, startAfter]);
  React.useEffect(() => {
    setAreas(
      Array.from(areasMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [areasMap]);
  // return
  return { areas, fetchNextPage };
};
