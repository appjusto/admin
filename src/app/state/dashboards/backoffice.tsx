import { useObserveBusinessesByStatus } from 'app/api/business/useObserveBusinessesByStatus';
import { useObserveNewConsumers } from 'app/api/consumer/useObserveNewConsumers';
import { useObserveCouriersByStatus } from 'app/api/courier/useObserveCouriersByStatus';
import { useObserveBODashboardOrders } from 'app/api/order/useObserveBODashboardOrders';
import { BusinessStatus, CourierStatus } from 'appjusto-types';
import React from 'react';

interface ContextProps {
  todayOrders?: number;
  todayDeliveredOrders?: number;
  todayValue?: number;
  todayAverage?: number;
  couriers?: number;
  businesses?: number;
  consumers?: number;
}

const BackofficeDashboardContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const courierStatuses = ['available', 'dispatching'] as CourierStatus[];
const businessesStatus = 'open' as BusinessStatus;

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  const { todayOrders, todayDeliveredOrders, todayAverage } = useObserveBODashboardOrders();
  const couriers = useObserveCouriersByStatus(courierStatuses);
  const businesses = useObserveBusinessesByStatus(businessesStatus);
  const consumers = useObserveNewConsumers();
  // state
  // provider
  return (
    <BackofficeDashboardContext.Provider
      value={{
        todayOrders,
        todayDeliveredOrders,
        todayAverage,
        couriers,
        businesses,
        consumers,
      }}
    >
      {children}
    </BackofficeDashboardContext.Provider>
  );
};

export const useContextBackofficeDashboard = () => {
  return React.useContext(BackofficeDashboardContext);
};
