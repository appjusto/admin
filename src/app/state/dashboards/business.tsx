import { useObserveDashboardOrders } from 'app/api/order/useObserveDashboardOrders';
import React from 'react';
import { useContextBusinessId } from '../business/context';

interface ContextProps {
  todayCount?: number;
  todayValue?: number;
  todayAverage?: number;
  monthCount?: number;
  monthValue?: number;
  monthAverage?: number;
  currentWeekCount?: number;
  currentWeekValue?: number;
  currentWeekAverage?: number;
  currentWeekProduct?: string;
  currentWeekByDay?: number[];
  lastWeekCount?: number;
  lastWeekValue?: number;
  lastWeekByDay?: number[];
}

const BusinessDashboardContext = React.createContext<ContextProps>(
  {} as ContextProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessDashboardProvider = ({ children }: Props) => {
  // context
  const businessId = useContextBusinessId();
  const {
    todayCount,
    todayValue,
    todayAverage,
    currentWeekProduct,
    monthCount,
    monthValue,
    monthAverage,
    currentWeekCount,
    currentWeekValue,
    currentWeekAverage,
    currentWeekByDay,
    lastWeekCount,
    lastWeekValue,
    lastWeekByDay,
  } = useObserveDashboardOrders(businessId);
  // state
  // provider
  return (
    <BusinessDashboardContext.Provider
      value={{
        todayCount,
        todayValue,
        todayAverage,
        currentWeekProduct,
        monthCount,
        monthValue,
        monthAverage,
        currentWeekCount,
        currentWeekValue,
        currentWeekAverage,
        currentWeekByDay,
        lastWeekCount,
        lastWeekValue,
        lastWeekByDay,
      }}
    >
      {children}
    </BusinessDashboardContext.Provider>
  );
};

export const useContextBusinessDashboard = () => {
  return React.useContext(BusinessDashboardContext);
};
