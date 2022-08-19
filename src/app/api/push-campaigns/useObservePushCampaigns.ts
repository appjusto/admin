import { PushCampaign, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialMap = new Map();

export const useObservePushCampaigns = (
  name?: string,
  start?: string,
  end?: string,
  status?: PushCampaign['status']
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('push_campaigns');
  // state
  const [campaignsMap, setCampaignsMap] =
    React.useState<Map<string | undefined, WithId<PushCampaign>[]>>(initialMap);
  const [campaigns, setCampaigns] = React.useState<WithId<PushCampaign>[]>();
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastPush, setLastPush] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastPush);
  }, [lastPush]);
  // side effects
  React.useEffect(() => {
    if (start && !end) return;
    setCampaignsMap(initialMap);
    setStartAfter(undefined);
  }, [name, start, end, status]);
  React.useEffect(() => {
    if (!userCanRead) return;
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.push_campaigns().observePushCampaigns(
      (results, last) => {
        setCampaignsMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastPush(last);
      },
      name,
      startDate,
      endDate,
      startAfter,
      status
    );
    return () => unsub();
  }, [api, userCanRead, startAfter, name, start, end, status]);
  React.useEffect(() => {
    setCampaigns(
      Array.from(campaignsMap.values()).reduce(
        (result, pushs) => [...result, ...pushs],
        []
      )
    );
  }, [campaignsMap]);
  // return
  return { campaigns, fetchNextPage };
};
