import { Area } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useObserveArea = (areaId: string) => {
  // context
  const api = useContextApi();
  // state
  const [area, setArea] = React.useState<Area | null>();
  // side effects
  React.useEffect(() => {
    if (!api) return;
    const unsub = api.areas().observeArea(areaId, setArea);
    return () => unsub();
  }, [api, areaId]);
  // return
  return area;
};
