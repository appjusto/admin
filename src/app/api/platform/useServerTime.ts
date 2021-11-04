import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useServerTime = () => {
  // context
  const api = useContextApi();
  // state
  const [delta, setDelta] = React.useState<number>();
  // handlers
  const getServerTime = React.useCallback(() => {
    if (delta) return new Date(new Date().getTime() + delta);
    return new Date();
  }, [delta]);
  // side effects
  React.useEffect(() => {
    (async () => {
      const serverTime = await api.platform().getServerTime();
      setDelta(serverTime - new Date().getTime());
    })();
  }, [api]);
  // result
  return getServerTime;
};
