import { Payment, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObservePayment = (paymentId?: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('payments');
  // state
  const [payment, setPayment] = React.useState<WithId<Payment> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!paymentId) return;
    const unsub = api.payments().observePayment(paymentId, setPayment);
    return () => unsub();
  }, [api, userCanRead, paymentId]);
  // return
  return payment;
};
