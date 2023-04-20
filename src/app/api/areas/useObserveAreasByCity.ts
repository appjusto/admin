import { Area } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useObserveAreasByCity = (state?: string, city?: string) => {
  // context
  const api = useContextApi();
  const { user } = useContextFirebaseUser();
  // state
  const [areas, setAreas] = React.useState<Area[] | null>();
  // side effects
  React.useEffect(() => {
    if (!api) return;
    if (!user) return;
    if (!state || !city) return;
    const unsub = api.areas().observeAreasByCity(state, city, setAreas);
    return () => unsub();
  }, [api, user, state, city]);
  // return
  return areas;
};
