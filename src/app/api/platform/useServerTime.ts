import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useServerTime = () => {
  // context
  const api = useContextApi();
  // state
  const [isUser, setIsUser] = React.useState(false);
  const [delta, setDelta] = React.useState<number>();
  // handlers
  const getServerTime = React.useCallback(() => {
    if (delta) return new Date(new Date().getTime() + delta);
    return new Date();
  }, [delta]);
  // side effects
  React.useEffect(() => {
    const unsub = api.auth().observeAuthState((user) => {
      if (user) setIsUser(true);
      else setIsUser(false);
    });
    return () => unsub();
  }, [api]);
  React.useEffect(() => {
    if (!isUser) return;
    (async () => {
      const serverTime = await api.platform().getServerTime();
      setDelta(serverTime - new Date().getTime());
    })();
  }, [api, isUser]);
  // result
  return getServerTime;
};
