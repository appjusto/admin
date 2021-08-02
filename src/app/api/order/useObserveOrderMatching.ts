import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { OrderMatching } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useObserveOrderMatching = (orderId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [matching, setMatching] = React.useState<OrderMatching | null>();
  // mutations
  const [updateCourierNotified, updateResult] = useMutation(async (data: string[]) =>
    api.order().updateOrderCourierNotified(orderId!, data)
  );
  const [restartMatching, restartResult] = useMutation(async () =>
    api.order().updateOrder(orderId!, { dispatchingStatus: 'matching' })
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (!isBackofficeUser) return;
    const unsub = api.order().observeOrderPrivateMatching(orderId, setMatching);
    return () => unsub();
  }, [api, orderId, isBackofficeUser]);
  // return
  return { matching, updateCourierNotified, updateResult, restartMatching, restartResult };
};
