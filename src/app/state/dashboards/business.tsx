import { useObserveDashboardInvoices } from 'app/api/invoices/useObserveDashboardInvoices';
import { useObserveDashboardOrders } from 'app/api/order/useObserveDashboardOrders';
import React from 'react';
import { useContextBusinessId } from '../business/context';

interface ContextProps {
  todayInvoices?: number;
  todayValue?: number;
  todayAverage?: number;
  monthInvoices?: number;
  monthValue?: number;
  monthAverage?: number;
  currentWeekInvoices?: number;
  currentWeekValue?: number;
  currentWeekAverage?: number;
  currentWeekProduct?: string;
  currentWeekByDay?: number[];
  lastWeekInvoices?: number;
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
    todayInvoices,
    todayValue,
    todayAverage,
    monthInvoices,
    monthValue,
    monthAverage,
    currentWeekInvoices,
    currentWeekValue,
    currentWeekAverage,
    currentWeekByDay,
    lastWeekInvoices,
    lastWeekValue,
    lastWeekByDay,
  } = useObserveDashboardInvoices(businessId);
  const { currentWeekProduct } = useObserveDashboardOrders(businessId);
  // state
  // provider
  return (
    <BusinessDashboardContext.Provider
      value={{
        todayInvoices,
        todayValue,
        todayAverage,
        monthInvoices,
        monthValue,
        monthAverage,
        currentWeekInvoices,
        currentWeekValue,
        currentWeekAverage,
        currentWeekProduct,
        currentWeekByDay,
        lastWeekInvoices,
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
