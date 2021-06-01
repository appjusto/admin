import { useContextApi } from 'app/state/api/context';
import { OrderStatus } from 'appjusto-types';
import React from 'react';

export const useOrderStatusTimestamp = (orderId: string | undefined, status: OrderStatus) => {
  // context
  const api = useContextApi();
  // state
  const [timestamp, setTimestamp] = React.useState<firebase.firestore.Timestamp | null>();
  // side effects
  React.useEffect(() => {
    if (!orderId || !status) return;
    api.order().getOrderStatusTimestamp(orderId, status, setTimestamp);
  }, [orderId, status]);
  // result
  return timestamp;
};
