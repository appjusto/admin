import { Order, OrderStatus, ProfileChange, WithId } from '@appjusto/types';
import { useObserveFlaggedOrders } from 'app/api/order/useObserveFlaggedOrders';
import { useObserveStaffOrders } from 'app/api/order/useObserveStaffOrders';
import {
  ProfileChangesSituations,
  useObserveUsersChanges,
} from 'app/api/users/useObserveUsersChanges';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';

interface ContextProps {
  // lists
  // activeOrders: WithId<Order>[];
  unsafeOrders: WithId<Order>[];
  matchingIssueOrders: WithId<Order>[];
  issueOrders: WithId<Order>[];
  watchedOrders: WithId<Order>[];
  userChanges: WithId<ProfileChange>[];
  // fetchNextActiveOrders(): void;
  fetchNextUnsafeOrders(): void;
  fetchNextIssueOrders(): void;
  fetchNextMatchingIssueOrders(): void;
  fetchNextChanges(): void;
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
const usersChangesSituations = ['pending'] as ProfileChangesSituations[];

const unsafeFlag = 'unsafe';
const matchingFlag = 'matching';
const issueFlag = 'issue';

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  const { user, isBackofficeSuperuser } = useContextFirebaseUser();
  // lists
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
  const watchedOrders = useObserveStaffOrders(statuses, user?.uid);
  const { userChanges, fetchNextPage: fetchNextChanges } =
    useObserveUsersChanges(usersChangesSituations);
  // provider
  return (
    <BackofficeDashboardContext.Provider
      value={{
        // activeOrders,
        unsafeOrders,
        matchingIssueOrders,
        issueOrders,
        watchedOrders,
        userChanges,
        // fetchNextActiveOrders,
        fetchNextUnsafeOrders,
        fetchNextMatchingIssueOrders,
        fetchNextIssueOrders,
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
