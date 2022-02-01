import { DispatchingStatus, OrderStatus } from 'appjusto-types';

export const getOrderMatchingColor = (
  orderStatus: OrderStatus,
  dispatchingStatus?: DispatchingStatus,
  courierId?: string
) => {
  if (courierId)
    return {
      bg: '#6CE787',
      color: 'black',
    };
  if (dispatchingStatus === 'idle') {
    if (['ready', 'dispatching'].includes(orderStatus) && !courierId) {
      return {
        bg: 'red',
        color: 'white',
      };
    }
  }
  if (dispatchingStatus === 'matching') {
    if (['ready', 'dispatching'].includes(orderStatus) && !courierId) {
      return {
        bg: 'red',
        color: 'white',
      };
    } else
      return {
        bg: '#055AFF',
        color: 'white',
      };
  }
  if (dispatchingStatus === 'no-match') {
    return {
      bg: 'red',
      color: 'white',
    };
  }
  if (dispatchingStatus === 'outsourced')
    return {
      bg: '#FFBE00',
      color: 'black',
    };
  return {
    bg: 'none',
    color: '#C8D7CB',
  };
};
