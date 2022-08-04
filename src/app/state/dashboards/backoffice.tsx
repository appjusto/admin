import {
  Business,
  BusinessStatus,
  CourierStatus,
  Order,
  OrderStatus,
  PlatformStatistics,
  ProfileChange,
  ProfileSituation,
  WithId
} from '@appjusto/types';
import { useObserveBusinesses } from 'app/api/business/useObserveBusinesses';
import { useObserveBusinessesByStatus } from 'app/api/business/useObserveBusinessesByStatus';
import { useObserveNewConsumers } from 'app/api/consumer/useObserveNewConsumers';
import { useObserveCouriersByStatus } from 'app/api/courier/useObserveCouriersByStatus';
import { useObserveBOActiveOrders } from 'app/api/order/useObserveBOActiveOrders';
import { useObserveBODashboardOrders } from 'app/api/order/useObserveBODashboardOrders';
import { OrderWithWarning, useObserveStaffOrders } from 'app/api/order/useObserveStaffOrders';
import { usePlatformParams } from 'app/api/platform/usePlatformParams';
import { usePlatformStatistics } from 'app/api/platform/usePlatformStatistics';
import {
  ProfileChangesSituations,
  useObserveUsersChanges
} from 'app/api/users/useObserveUsersChanges';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';
import { useContextServerTime } from '../server-time';

interface ContextProps {
  // panel
  statistics?: PlatformStatistics;
  todayOrders?: number;
  todayDeliveredOrders?: number;
  todayValue?: number;
  todayAverage?: number;
  couriers?: number;
  businessesNumber?: number;
  consumers?: number;
  // lists
  activeOrders: WithId<Order>[];
  watchedOrders: WithId<OrderWithWarning>[];
  businesses: WithId<Business>[];
  userChanges: WithId<ProfileChange>[];
  fetchNextActiveOrders(): void;
  fetchNextBusiness(): void;
  fetchNextChanges(): void;
}

const BackofficeDashboardContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const courierStatuses = ['available', 'dispatching'] as CourierStatus[];
const businessesStatus = 'open' as BusinessStatus;
const businessSituations = ['submitted', 'verified', 'invalid'] as ProfileSituation[];
const usersChangesSituations = ['pending'] as ProfileChangesSituations[];
const statuses = ['charged', 'confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  const { user, isBackofficeSuperuser } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  // panel
  const statistics = usePlatformStatistics();
  const { platformParams } = usePlatformParams();
  const { todayOrders, todayDeliveredOrders, todayAverage } = useObserveBODashboardOrders();
  const couriers = useObserveCouriersByStatus(courierStatuses);
  const businessesNumber = useObserveBusinessesByStatus(businessesStatus);
  const consumers = useObserveNewConsumers();
  // lists
  const { businesses, fetchNextPage: fetchNextBusiness } = useObserveBusinesses(businessSituations);
  const { orders: activeOrders, fetchNextOrders: fetchNextActiveOrders } = useObserveBOActiveOrders(statuses, !isBackofficeSuperuser);
  const watchedOrders = useObserveStaffOrders(
    getServerTime, 
    statuses, 
    user?.uid,
    platformParams?.orders.backofficeWarnings
  );
  const { userChanges, fetchNextPage: fetchNextChanges } =
    useObserveUsersChanges(usersChangesSituations);
  // provider
  return (
    <BackofficeDashboardContext.Provider
      value={{
        statistics,
        todayOrders,
        todayDeliveredOrders,
        todayAverage,
        couriers,
        businessesNumber,
        consumers,
        activeOrders,
        watchedOrders, 
        businesses,
        userChanges,
        fetchNextActiveOrders,
        fetchNextBusiness,
        fetchNextChanges,
      }}
    >
      {children}
    </BackofficeDashboardContext.Provider>
  );
};

export const useContextBackofficeDashboard = () => {
  return React.useContext(BackofficeDashboardContext);
};
