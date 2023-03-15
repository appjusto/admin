import { Area } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveAreas = (state?: string, city?: string) => {
  // context
  const api = useContextApi();
  // state
  const [areas, setAreas] = React.useState<Area[] | null>();
  // side effects
  React.useEffect(() => {
    if (!api) return;
    const unsub = api.areas().observeAreas(setAreas, state, city);
    return () => unsub();
  }, [api, state, city]);
  // return
  return areas;
};
