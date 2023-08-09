import { DashboardProps } from 'app/api/order/dashboard/reducer';
import { useObserveDashboardOrders } from 'app/api/order/dashboard/useObserveDashboardOrders';
import React from 'react';
import { useContextBusinessId } from '../business/context';

const BusinessDashboardContext = React.createContext<DashboardProps>(
  {} as DashboardProps
);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessDashboardProvider = ({ children }: Props) => {
  // context
  const businessId = useContextBusinessId();
  const dashboard = useObserveDashboardOrders(businessId);
  // state
  // provider
  return (
    <BusinessDashboardContext.Provider value={dashboard}>
      {children}
    </BusinessDashboardContext.Provider>
  );
};

export const useContextBusinessDashboard = () => {
  return React.useContext(BusinessDashboardContext);
};
