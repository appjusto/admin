import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useServerTime = (loggedUser: boolean) => {
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
    if (!loggedUser) return;
    (async () => {
      const serverTime = await api.platform().getServerTime();
      if (serverTime === 0) setDelta(serverTime);
      else setDelta(serverTime - new Date().getTime());
    })();
  }, [api, loggedUser]);
  // result
  return getServerTime;
};
