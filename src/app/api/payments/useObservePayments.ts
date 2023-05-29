import { Payment, PaymentStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const initialMap = new Map();

export const useObservePayments = (
  orderCode?: string | null,
  start?: string,
  end?: string,
  status?: PaymentStatus
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('payments');
  // state
  const [paymentsMap, setPaymentsMap] =
    React.useState<Map<string | undefined, WithId<Payment>[]>>(initialMap);
  const [payments, setPayments] = React.useState<WithId<Payment>[] | null>();
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastPayment, setLastPayment] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastPayment);
  }, [lastPayment]);
  // side effects
  React.useEffect(() => {
    if (start && !end) return;
    setPaymentsMap(initialMap);
    setStartAfter(undefined);
  }, [orderCode, start, end, status]);
  React.useEffect(() => {
    if (!userCanRead) return;
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.payments().observePayments(
      (results, last) => {
        setPaymentsMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastPayment(last);
      },
      orderCode,
      startDate,
      endDate,
      startAfter,
      status
    );
    return () => unsub();
  }, [api, userCanRead, startAfter, orderCode, start, end, status]);
  React.useEffect(() => {
    setPayments(
      Array.from(paymentsMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [paymentsMap]);
  // return
  return { payments, fetchNextPage };
};
