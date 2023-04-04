import { DispatchingStatus, Fare, OrderFlag, OrderType } from '@appjusto/types';
import { ListType } from './BOList';
import { IconsConfig } from './order-item/OrderItemIcons';

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

export const getIconsConfig = (
  isSuperuser?: boolean | null,
  listType?: ListType,
  staffId?: string,
  orderType?: OrderType,
  flags?: OrderFlag[],
  orderFare?: Fare,
  dispatchingStatus?: DispatchingStatus,
  courierId?: string
) => {
  let iconsConfig = {} as IconsConfig;
  if (isSuperuser) {
    iconsConfig.isStaff = typeof staffId === 'string';
  }
  if (listType === 'orders-watched') {
    iconsConfig.isMessages = flags && flags.includes('chat');
  }
  if (listType === 'orders-watched' || listType === 'orders-unsafe') {
    iconsConfig.isUnsafe = flags && flags.includes('unsafe');
  }
  if (listType === 'orders-watched' || listType === 'orders-issue') {
    iconsConfig.isIssue = flags && flags.includes('issue');
  }
  if (listType === 'orders-watched' || listType === 'orders-warning') {
    const isConfirmedOverLimit =
      orderType === 'food'
        ? flags && flags.includes('waiting-confirmation')
        : undefined;
    const isMatchinFlag = flags ? flags.includes('matching') : false;
    const courierIconStatus =
      orderFare?.courier?.payee === 'platform'
        ? getOrderMatchingColor(isMatchinFlag, dispatchingStatus, courierId)
        : undefined;
    const isPickupOverLimit =
      orderFare?.courier?.payee === 'platform'
        ? flags
          ? flags.includes('pick-up')
          : false
        : undefined;
    const isDispatchingOverLimit = flags ? flags.includes('delivering') : false;
    iconsConfig = {
      ...iconsConfig,
      isConfirmedOverLimit,
      courierIconStatus,
      isPickupOverLimit,
      isDispatchingOverLimit,
    };
  }
  return iconsConfig;
};
