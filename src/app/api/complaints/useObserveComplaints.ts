import { Complaint, ComplaintStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialMap = new Map();

export const useObserveComplaints = (
  status?: ComplaintStatus,
  complaintCode?: string,
  orderId?: string,
  courierId?: string,
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('complaints');
  // state
  const [complaintsMap, setComplaintsMap] =
    React.useState<Map<string | undefined, WithId<Complaint>[]>>(initialMap);
  const [complaints, setComplaints] = React.useState<WithId<Complaint>[]>();
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
    setComplaintsMap(initialMap);
    setStartAfter(undefined);
  }, [start, end, status]);
  React.useEffect(() => {
    if (!userCanRead) return;
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.complaints().observeComplaints(
      (results, last) => {
        setComplaintsMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastPush(last);
      },
      status,
      complaintCode,
      orderId,
      courierId,
      startDate,
      endDate,
      startAfter
    );
    return () => unsub();
  }, [
    api,
    userCanRead,
    startAfter,
    complaintCode,
    orderId,
    courierId,
    start,
    end,
    status,
  ]);
  React.useEffect(() => {
    setComplaints(
      Array.from(complaintsMap.values()).reduce(
        (result, pushs) => [...result, ...pushs],
        []
      )
    );
  }, [complaintsMap]);
  // return
  return { complaints, fetchNextPage };
};
