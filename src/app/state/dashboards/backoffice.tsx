import {
  Business,
  Order,
  OrderStatus,
  ProfileChange,
  WithId,
} from '@appjusto/types';
import { useObserveFlaggedOrders } from 'app/api/order/useObserveFlaggedOrders';
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
  // activeOrders: WithId<Order>[];
  unsafeOrders: WithId<Order>[];
  matchingIssueOrders: WithId<Order>[];
  issueOrders: WithId<Order>[];
  watchedOrders: WithId<OrderWithWarning>[];
  businesses: WithId<Business>[];
  userChanges: WithId<ProfileChange>[];
  // fetchNextActiveOrders(): void;
  fetchNextUnsafeOrders(): void;
  fetchNextIssueOrders(): void;
  fetchNextMatchingIssueOrders(): void;
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

const unsafeFlag = 'unsafe';
const matchingFlag = 'matching';
const issueFlag = 'issue';

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  const { user, isBackofficeSuperuser } = useContextFirebaseUser();
  const { getServerTime } = useContextServerTime();
  // panel
  const { platformParams } = usePlatformParams();
  // lists
  // const { businesses, fetchNextPage: fetchNextBusiness } = useObserveBusinesses(businessSituations);
  // const { orders: activeOrders, fetchNextOrders: fetchNextActiveOrders } =
  //   useObserveBOActiveOrders(statuses, !isBackofficeSuperuser);
  const { orders: unsafeOrders, fetchNextOrders: fetchNextUnsafeOrders } =
    useObserveFlaggedOrders(statuses, unsafeFlag, !isBackofficeSuperuser);
  const {
    orders: matchingIssueOrders,
    fetchNextOrders: fetchNextMatchingIssueOrders,
  } = useObserveFlaggedOrders(statuses, matchingFlag, !isBackofficeSuperuser);
  const { orders: issueOrders, fetchNextOrders: fetchNextIssueOrders } =
    useObserveFlaggedOrders(statuses, issueFlag, !isBackofficeSuperuser);
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
        // activeOrders,
        unsafeOrders,
        matchingIssueOrders,
        issueOrders,
        watchedOrders,
        businesses: [],
        userChanges: [],
        // fetchNextActiveOrders,
        fetchNextUnsafeOrders,
        fetchNextMatchingIssueOrders,
        fetchNextIssueOrders,
      }}
    >
      {children}
    </BackofficeDashboardContext.Provider>
  );
};

export const useContextBackofficeDashboard = () => {
  return React.useContext(BackofficeDashboardContext);
};
