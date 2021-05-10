import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { useOrderArrivalTimes } from './useOrderArrivalTimes';

export const useOrderDeliveryInfos = (order?: WithId<Order> | null) => {
  // state
  const arrivalTime = useOrderArrivalTimes(order);
  const [isOrderActive, setIsOrderActive] = React.useState<boolean>();
  const [isMatched, setIsMatched] = React.useState<boolean>(order?.dispatchingStatus === 'matched');
  const [isCurrierArrived, setIsCurrierArrived] = React.useState<boolean>(
    order?.dispatchingState === 'arrived-pickup'
  );
  const [orderDispatchingStatusText, setOrderDispatchingStatusText] = React.useState<string>();

  // side effects
  React.useEffect(() => {
    if (order?.status)
      setIsOrderActive(['confirmed', 'preparing', 'ready', 'dispatching'].includes(order.status));
  }, [order?.status]);

  React.useEffect(() => {
    const getOrderDispatchingStatusText = (status?: string) => {
      let result = 'Buscando entregador';
      if (status === 'going-pickup') result = 'Entregador à caminho da retirada';
      if (status === 'arrived-pickup') result = 'Entregador no local';
      if (status === 'going-destination') result = 'Entregador à caminho da entrega';
      if (status === 'arrived-destination') result = 'Entregador no local de entrega';
      setOrderDispatchingStatusText(result);
    };
    getOrderDispatchingStatusText(order?.dispatchingState);
    setIsCurrierArrived(order?.dispatchingState === 'arrived-pickup');
  }, [order?.dispatchingState]);

  React.useEffect(() => {
    if (order?.dispatchingStatus)
      setIsMatched(['matched', 'confirmed'].includes(order?.dispatchingStatus));
  }, [order?.dispatchingStatus]);

  React.useEffect(() => {
    if (order?.status)
      setIsOrderActive(['confirmed', 'preparing', 'ready', 'dispatching'].includes(order.status));
  }, [order?.status]);

  // result
  return { isOrderActive, isMatched, isCurrierArrived, arrivalTime, orderDispatchingStatusText };
};
