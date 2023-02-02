import {
  CourierOrderRequest,
  OrderMatching,
  OrderMatchingLog,
  WithId,
} from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialLogsMap = new Map();
const initialCouriersMap = new Map();

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
  const [notifiedCouriersMap, setNotifiedCouriersMap] =
    React.useState<Map<string | undefined, WithId<CourierOrderRequest>[]>>(
      initialCouriersMap
    );
  const [notifiedCouriers, setNotifiedCouriers] =
    React.useState<WithId<CourierOrderRequest>[]>();
  const [startAfterRequest, setStartAfterRequest] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastRequest, setLastRequest] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextMatchingLogs = React.useCallback(() => {
    setStartAfter(lastLog);
  }, [lastLog]);
  const fetchNextOrderNotifiedCouriers = React.useCallback(() => {
    setStartAfterRequest(lastRequest);
  }, [lastRequest]);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isBackofficeUser) return;
    if (!isActive) return;
    const unsub = api.order().observeOrderPrivateMatching(orderId, setMatching);
    return () => unsub();
  }, [api, userCanRead, orderId, isBackofficeUser, isActive]);
  // order matching logs
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isBackofficeUser) return;
    if (!isActive) return;
    const unsub = api.order().observeOrderMatchingLogs(
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
    return () => unsub();
  }, [api, userCanRead, orderId, isBackofficeUser, isActive, startAfter]);
  React.useEffect(() => {
    setLogs(
      Array.from(logsMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [logsMap]);
  // order couriers notified
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isBackofficeUser) return;
    if (!isActive) return;
    const unsub = api.order().observeOrderNotifiedCouriers(
      orderId,
      (results, last) => {
        setNotifiedCouriersMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfterRequest?.id, results);
          return value;
        });
        if (last) setLastRequest(last);
      },
      startAfterRequest
    );
    return () => unsub();
  }, [
    api,
    userCanRead,
    orderId,
    isBackofficeUser,
    isActive,
    startAfterRequest,
  ]);
  React.useEffect(() => {
    setNotifiedCouriers(
      Array.from(notifiedCouriersMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [notifiedCouriersMap]);
  // return
  return {
    matching,
    logs,
    notifiedCouriers,
    fetchNextMatchingLogs,
    fetchNextOrderNotifiedCouriers,
  };
};
