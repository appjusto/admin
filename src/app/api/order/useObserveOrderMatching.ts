import { OrderMatching, OrderMatchingLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveOrderMatching = (orderId?: string) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [matching, setMatching] = React.useState<OrderMatching | null>();
  const [logs, setLogs] = React.useState<WithId<OrderMatchingLog>[]>();
  // mutations
  const { mutateAsync: updateCourierNotified, mutationResult: updateResult } = useCustomMutation(
    async (data: string[]) => api.order().updateOrderCourierNotified(orderId!, data),
    'updateCourierNotified'
  );
  const { mutate: restartMatching, mutationResult: restartResult } = useCustomMutation(
    () => api.order().updateOrder(orderId!, { dispatchingStatus: 'scheduled' }),
    'restartMatching',
    false
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (!isBackofficeUser) return;
    const unsub1 = api.order().observeOrderPrivateMatching(orderId, setMatching);
    const unsub2 = api
      .order()
      .observeOrderLogs(orderId, 'matching', (result) =>
        setLogs(result as WithId<OrderMatchingLog>[])
      );
    return () => {
      unsub1();
      unsub2();
    };
  }, [api, orderId, isBackofficeUser]);
  // return
  return { matching, logs, updateCourierNotified, updateResult, restartMatching, restartResult };
};
