import {
  Business,
  Order,
  OrderStatus,
  ProfileChange,
  WithId,
} from '@appjusto/types';
import { useObserveBOActiveOrders } from 'app/api/order/useObserveBOActiveOrders';
import {
  OrderWithWarning,
  useObserveStaffOrders,
} from 'app/api/order/useObserveStaffOrders';
import { usePlatformParams } from 'app/api/platform/usePlatformParams';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';
import { useContextServerTime } from '../server-time';

interface ContextProps {
  // lists
  activeOrders: WithId<Order>[];
  watchedOrders: WithId<OrderWithWarning>[];
  businesses: WithId<Business>[];
  userChanges: WithId<ProfileChange>[];
  fetchNextActiveOrders(): void;
  fetchNextBusiness?(): void;
  fetchNextChanges?(): void;
}

const BackofficeDashboardContext = React.createContext<ContextProps>(
  {} as ContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const statuses = [
  'charged',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
] as OrderStatus[];

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  const { user, isBackofficeSuperuser } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  // panel
  const { platformParams } = usePlatformParams();
  // lists
  // const { businesses, fetchNextPage: fetchNextBusiness } = useObserveBusinesses(businessSituations);
  const { orders: activeOrders, fetchNextOrders: fetchNextActiveOrders } =
    useObserveBOActiveOrders(statuses, !isBackofficeSuperuser);
  const watchedOrders = useObserveStaffOrders(
    getServerTime,
    statuses,
    user?.uid,
    platformParams?.orders.backofficeWarnings
  );
  // const { userChanges, fetchNextPage: fetchNextChanges } =
  //   useObserveUsersChanges(usersChangesSituations);
  // provider
  return (
    <BackofficeDashboardContext.Provider
      value={{
        activeOrders,
        watchedOrders,
        businesses: [],
        userChanges: [],
        fetchNextActiveOrders,
      }}
    >
      {children}
    </BackofficeDashboardContext.Provider>
  );
};

export const useContextBackofficeDashboard = () => {
  return React.useContext(BackofficeDashboardContext);
};
