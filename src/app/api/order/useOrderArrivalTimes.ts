import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { getTimeUntilNow } from 'utils/functions';

export const useOrderArrivalTimes = (order?: WithId<Order> | null) => {
  // state
  const [arrivalTime, setArrivalTime] = React.useState<number | null>(null);

  // handlers
  const handleArrivalTime = React.useCallback((baseTime: firebase.firestore.Timestamp) => {
    if (baseTime) {
      const newTime = getTimeUntilNow(baseTime.toMillis(), true);
      setArrivalTime(newTime);
    }
  }, []);

  // side effects
  React.useEffect(() => {
    if (!order) return;
    const courierArrivalTime = order.origin?.estimatedTimeOfArrival as firebase.firestore.Timestamp;
    const orderArrivalTime = order.destination
      ?.estimatedTimeOfArrival as firebase.firestore.Timestamp;
    let arrivalInterval: NodeJS.Timeout;
    if (order.status === 'ready' && order.dispatchingState === 'going-pickup') {
      arrivalInterval = setInterval(() => handleArrivalTime(courierArrivalTime), 60000);
      handleArrivalTime(courierArrivalTime);
    } else if (order.status === 'dispatching') {
      arrivalInterval = setInterval(() => handleArrivalTime(orderArrivalTime), 60000);
      handleArrivalTime(orderArrivalTime);
    }
    return () => clearInterval(arrivalInterval);
  }, [order, handleArrivalTime]);

  // result
  return arrivalTime;
};
