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
import { useObserveStaffOrders } from 'app/api/order/useObserveStaffOrders';
import { usePlatformStatistics } from 'app/api/platform/usePlatformStatistics';
import {
  ProfileChangesSituations,
  useObserveUsersChanges
} from 'app/api/users/useObserveUsersChanges';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';

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
  noStaffOrders: WithId<Order>[];
  staffOrders: WithId<Order>[];
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
  // panel
  const statistics = usePlatformStatistics();
  const { todayOrders, todayDeliveredOrders, todayAverage } = useObserveBODashboardOrders();
  const couriers = useObserveCouriersByStatus(courierStatuses);
  const businessesNumber = useObserveBusinessesByStatus(businessesStatus);
  const consumers = useObserveNewConsumers();
  // lists
  const { businesses, fetchNextPage: fetchNextBusiness } = useObserveBusinesses(businessSituations);
  const { orders: noStaffOrders, fetchNextOrders: fetchNextActiveOrders } = useObserveBOActiveOrders(statuses, isBackofficeSuperuser ? false : true)
  const staffOrders = useObserveStaffOrders(statuses, user?.uid);
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
        noStaffOrders,
        staffOrders,
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
