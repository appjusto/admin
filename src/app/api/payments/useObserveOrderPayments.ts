import { OrderPaymentLog, Payment, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderPayments = (
  orderId?: string,
  isActive: boolean = true
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('payments');
  const businessId = useContextBusinessId();
  // state
  const [payments, setPayments] = React.useState<WithId<Payment>[] | null>();
  const [logs, setLogs] = React.useState<WithId<OrderPaymentLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isActive) return;
    const unsub1 = api.payments().observeOrderPayments(orderId, setPayments);
    const unsub2 = api
      .order()
      .observeOrderLogs(orderId, 'payment', (logs) =>
        setLogs(logs as WithId<OrderPaymentLog>[])
      );
    return () => {
      unsub1();
      unsub2();
    };
  }, [api, userCanRead, businessId, orderId, isActive]);
  // return
  return { payments, logs };
};
