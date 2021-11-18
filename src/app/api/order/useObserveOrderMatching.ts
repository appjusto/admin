import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { OrderMatching } from 'appjusto-types';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveOrderMatching = (orderId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [matching, setMatching] = React.useState<OrderMatching | null>();
  // mutations
  const { mutateAsync: updateCourierNotified, mutationResult: updateResult } = useCustomMutation(
    async (data: string[]) => api.order().updateOrderCourierNotified(orderId!, data),
    'updateCourierNotified'
  );
  const { mutateAsync: restartMatching, mutationResult: restartResult } = useCustomMutation(
    async () => api.order().updateOrder(orderId!, { dispatchingStatus: 'matching' }),
    'restartMatching',
    false
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
