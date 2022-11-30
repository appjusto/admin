import { OrderMatching, OrderMatchingLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialLogsMap = new Map();

export const useObserveOrderMatching = (
  orderId?: string,
  isActive: boolean = true
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [matching, setMatching] = React.useState<OrderMatching | null>();
  const [logsMap, setLogsMap] =
    React.useState<Map<string | undefined, WithId<OrderMatchingLog>[]>>(
      initialLogsMap
    );
  const [logs, setLogs] = React.useState<WithId<OrderMatchingLog>[]>();
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastLog, setLastLog] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextMatchingLogs = React.useCallback(() => {
    setStartAfter(lastLog);
  }, [lastLog]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isBackofficeUser) return;
    if (!isActive) return;
    const unsub1 = api
      .order()
      .observeOrderPrivateMatching(orderId, setMatching);
    return () => unsub1();
  }, [api, userCanRead, orderId, isBackofficeUser, isActive]);
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isBackofficeUser) return;
    if (!isActive) return;
    const unsub2 = api.order().observeOrderMatchingLogs(
      orderId,
      (results, last) => {
        setLogsMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastLog(last);
      },
      startAfter
    );
    return () => unsub2();
  }, [api, userCanRead, orderId, isBackofficeUser, isActive, startAfter]);
  React.useEffect(() => {
    setLogs(
      Array.from(logsMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [logsMap]);
  // return
  return { matching, logs, fetchNextMatchingLogs };
};
