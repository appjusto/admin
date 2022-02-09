import { useObserveBusinesses } from 'app/api/business/useObserveBusinesses';
import { useObserveBusinessesByStatus } from 'app/api/business/useObserveBusinessesByStatus';
import { useObserveNewConsumers } from 'app/api/consumer/useObserveNewConsumers';
import { useObserveCouriersByStatus } from 'app/api/courier/useObserveCouriersByStatus';
import { useObserveBODashboardOrders } from 'app/api/order/useObserveBODashboardOrders';
import { useObserveOrders } from 'app/api/order/useObserveOrders';
import { usePlatformStatistics } from 'app/api/platform/usePlatformStatistics';
import {
  ProfileChangesSituations,
  useObserveUsersChanges,
} from 'app/api/users/useObserveUsersChanges';
import {
  Business,
  BusinessStatus,
  CourierStatus,
  Order,
  OrderStatus,
  PlatformStatistics,
  ProfileChange,
  WithId,
} from 'appjusto-types';
import React from 'react';

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
  orders: WithId<Order>[];
  businesses: WithId<Business>[];
  userChanges: WithId<ProfileChange>[];
  fetchNextBusiness(): void;
  fetchNextChanges(): void;
}

const BackofficeDashboardContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const courierStatuses = ['available', 'dispatching'] as CourierStatus[];
const businessesStatus = 'open' as BusinessStatus;
const businessSituations = ['submitted', 'verified', 'invalid'];
const usersChangesSituations = ['pending'] as ProfileChangesSituations[];
const statuses = ['charged', 'confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  // panel
  const statistics = usePlatformStatistics();
  const { todayOrders, todayDeliveredOrders, todayAverage } = useObserveBODashboardOrders();
  const couriers = useObserveCouriersByStatus(courierStatuses);
  const businessesNumber = useObserveBusinessesByStatus(businessesStatus);
  const consumers = useObserveNewConsumers();
  // lists
  const { businesses, fetchNextPage: fetchNextBusiness } = useObserveBusinesses(businessSituations);
  const orders = useObserveOrders(statuses);
  const { userChanges, fetchNextPage: fetchNextChanges } = useObserveUsersChanges(
    usersChangesSituations
  );
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
        orders,
        businesses,
        userChanges,
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
