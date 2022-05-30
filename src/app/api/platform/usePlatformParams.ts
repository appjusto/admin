import { PlatformParams } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextServerTime } from 'app/state/server-time';
import dayjs from 'dayjs';
import React from 'react';

export const usePlatformParams = () => {
  // context
  const api = useContextApi();
  const { getServerTime } = useContextServerTime();
  // state
  const [platformParams, setPlatformParams] = React.useState<PlatformParams | null>();
  const [isPlatformLive, setIsPlatformLive] = React.useState(true);
  // side effects
  React.useEffect(() => {
    const unsub = api.platform().observeParams(setPlatformParams);
    return () => unsub();
  }, [api]);

  React.useEffect(() => {
    if (!platformParams?.consumer.support) return;
    const { support } = platformParams.consumer;
    const startH = parseInt(support.starts.slice(0, 2));
    const startM = parseInt(support.starts.slice(2));
    const endH = parseInt(support.ends.slice(0, 2));
    const endM = parseInt(support.ends.slice(2));
    const now = getServerTime();
    const start = dayjs().hour(startH).minute(startM).toDate();
    const end = dayjs().hour(endH).minute(endM).toDate();
    if (now > start && now < end) setIsPlatformLive(true);
    else setIsPlatformLive(false);
  }, [getServerTime, platformParams]);
  // result
  return { platformParams, isPlatformLive };
};
