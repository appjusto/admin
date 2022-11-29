import { DispatchingStatus } from '@appjusto/types';

export const getOrderMatchingColor = (
  isFlagged: boolean,
  dispatchingStatus?: DispatchingStatus,
  courierId?: string
) => {
  if (isFlagged && courierId) {
    return {
      bg: '#6CE787',
      border: '2px solid red',
      color: 'black',
    };
  }
  if (isFlagged && dispatchingStatus === 'outsourced') {
    return {
      bg: '#FFBE00',
      border: '2px solid red',
      color: 'black',
    };
  }
  if (isFlagged) {
    return {
      bg: 'red',
      border: 'none',
      color: 'white',
    };
  }
  if (courierId)
    return {
      bg: '#6CE787',
      border: 'none',
      color: 'black',
    };
  if (dispatchingStatus === 'outsourced')
    return {
      bg: '#FFBE00',
      border: 'none',
      color: 'black',
    };
  return {
    bg: 'none',
    border: 'none',
    color: '#C8D7CB',
  };
};
