import { Order, WithId } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { getTimeUntilNow } from 'utils/functions';

export const useOrderArrivalTimes = (
  getServerTime: () => Date,
  order?: WithId<Order> | null
) => {
  // state
  const [arrivalTime, setArrivalTime] = React.useState<number | null>(null);
  // handlers
  const handleArrivalTime = React.useCallback(
    (baseTime: Timestamp) => {
      if (!baseTime) return;
      const now = getServerTime().getTime();
      const newTime = getTimeUntilNow(now, baseTime.toMillis(), true);
      setArrivalTime(newTime);
    },
    [getServerTime]
  );
  // side effects
  React.useEffect(() => {
    if (!order) return;
    const courierArrivalTime = order.arrivals?.origin?.estimate as Timestamp;
    const orderArrivalTime = order.arrivals?.destination?.estimate as Timestamp;
    let arrivalInterval: NodeJS.Timeout;
    if (order.status === 'ready' && order.dispatchingState === 'going-pickup') {
      arrivalInterval = setInterval(
        () => handleArrivalTime(courierArrivalTime),
        60000
      );
      handleArrivalTime(courierArrivalTime);
    } else if (order.status === 'dispatching') {
      arrivalInterval = setInterval(
        () => handleArrivalTime(orderArrivalTime),
        60000
      );
      handleArrivalTime(orderArrivalTime);
    }
    return () => clearInterval(arrivalInterval);
  }, [order, handleArrivalTime]);
  // result
  return arrivalTime;
};
