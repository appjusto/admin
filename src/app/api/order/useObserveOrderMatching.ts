import { useContextApi } from 'app/state/api/context';
import { OrderMatching } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useObserveOrderMatching = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [matching, setMatching] = React.useState<OrderMatching | null>();
  // mutations
  const [updateCourierNotified, updateResult] = useMutation(async (data: string[]) =>
    api.order().updateOrderCourierNotified(orderId!, data)
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrderPrivateMatching(orderId, setMatching);
    return () => unsub();
  }, [orderId, api]);
  // return
  return { matching, updateCourierNotified, updateResult };
};
