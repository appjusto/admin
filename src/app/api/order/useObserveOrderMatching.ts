import { OrderMatching, OrderMatchingLog, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderMatching = (
  orderId?: string,
  isDisabled?: boolean
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [matching, setMatching] = React.useState<OrderMatching | null>();
  const [logs, setLogs] = React.useState<WithId<OrderMatchingLog>[]>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId) return;
    if (!isBackofficeUser) return;
    if (isDisabled) return;
    const unsub1 = api
      .order()
      .observeOrderPrivateMatching(orderId, setMatching);
    const unsub2 = api
      .order()
      .observeOrderLogs(orderId, 'matching', (result) =>
        setLogs(result as WithId<OrderMatchingLog>[])
      );
    return () => {
      unsub1();
      unsub2();
    };
  }, [api, userCanRead, orderId, isBackofficeUser, isDisabled]);
  // return
  return { matching, logs };
};
