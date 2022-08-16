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
  warningOrders: WithId<Order>[];
  issueOrders: WithId<Order>[];
  watchedOrders: WithId<Order>[];
  userChanges: WithId<ProfileChange>[];
  // fetchNextActiveOrders(): void;
  fetchNextUnsafeOrders(): void;
  fetchNextIssueOrders(): void;
  fetchNextWarningOrders(): void;
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
const unsafeStatus = 'charged';
const usersChangesSituations = ['pending'] as ProfileChangesSituations[];

const unsafeFlags = ['unsafe'];
const autoFlags = ['matching', 'waiting-confirmation'];
const issueFlags = ['issue'];

export const BackofficeDashboardProvider = ({ children }: Props) => {
  // context
  const { user, isBackofficeSuperuser } = useContextFirebaseUser();
  // lists
  // const { orders: activeOrders, fetchNextOrders: fetchNextActiveOrders } =
  //   useObserveBOActiveOrders(statuses, !isBackofficeSuperuser);
  const { orders: unsafeOrders, fetchNextOrders: fetchNextUnsafeOrders } =
    useObserveFlaggedOrders(unsafeFlags, !isBackofficeSuperuser, unsafeStatus);
  const { orders: warningOrders, fetchNextOrders: fetchNextWarningOrders } =
    useObserveFlaggedOrders(autoFlags, !isBackofficeSuperuser);
  const { orders: issueOrders, fetchNextOrders: fetchNextIssueOrders } =
    useObserveFlaggedOrders(issueFlags, !isBackofficeSuperuser);
  const watchedOrders = useObserveStaffOrders(statuses, user?.uid);
  const { userChanges, fetchNextPage: fetchNextChanges } =
    useObserveUsersChanges(usersChangesSituations);
  // provider
  return (
    <BackofficeDashboardContext.Provider
      value={{
        // activeOrders,
        unsafeOrders,
        warningOrders,
        issueOrders,
        watchedOrders,
        userChanges,
        // fetchNextActiveOrders,
        fetchNextUnsafeOrders,
        fetchNextWarningOrders,
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
