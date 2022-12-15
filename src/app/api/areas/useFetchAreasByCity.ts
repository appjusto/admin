import { Area } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useFetchAreasByCity = (state?: string, city?: string) => {
  // context
  const api = useContextApi();
  // state
  const [areas, setAreas] = React.useState<Area[]>([]);
  // side effects
  React.useEffect(() => {
    if (!api) return;
    if (!state || !city) return;
    (async () => {
      const areas = await api.areas().fetchAreaByCity(state, city);
      setAreas(areas);
    })();
  }, [api, state, city]);
  // return
  return areas;
};
