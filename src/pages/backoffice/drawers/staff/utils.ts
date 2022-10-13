import { UserPermissions } from '@appjusto/types';
import { fullStaffPermissions } from 'app/state/auth/utils';
import { isEqual } from 'lodash';

export type GenericMode =
  | 'owner'
  | 'orders-manager'
  | 'couriers-manager'
  | 'consumers-manager'
  | 'businesses-manager'
  | 'businesses-account-manager'
  | 'viewer'
  | 'custom';

const backofficeOwnerObject = (() => {
  const permissions = {} as UserPermissions;
  Object.keys(fullStaffPermissions).forEach((subject) => {
    permissions[subject] = ['c', 'r', 'u', 'd'];
  });
  return permissions;
})();

const ordersManagerObject = {
  ...(fullStaffPermissions as UserPermissions),
  orders: ['r', 'u'],
  couriers: ['r', 'u'],
  consumers: ['r'],
  // account_manager: [],
  businesses: ['r', 'u'],
  menu: ['r'],
  chats: ['r'],
  invoices: ['r'],
  withdraws: ['r'],
  advances: ['r'],
  managers: ['r', 'u'],
  recommendations: ['r', 'u'],
  push_campaigns: ['r'],
  // staff: [],
  users: ['r'],
  platform: ['r'],
} as UserPermissions;

const consumersManagerObject = {
  ...(fullStaffPermissions as UserPermissions),
  orders: ['r'],
  // couriers: [],
  consumers: ['r', 'u'],
  // account_manager: [],
  businesses: ['r'],
  menu: ['r'],
  chats: ['r'],
  invoices: ['r'],
  withdraws: ['r'],
  advances: ['r'],
  managers: ['r'],
  recommendations: ['r', 'u'],
  push_campaigns: ['r'],
  // staff: [],
  users: ['r'],
  // platform: [],
} as UserPermissions;

const couriersManagerObject = {
  ...(fullStaffPermissions as UserPermissions),
  orders: ['r'],
  couriers: ['r', 'u'],
  // consumers: [],
  // account_manager: [],
  businesses: ['r'],
  menu: ['r'],
  chats: ['r'],
  invoices: ['r'],
  withdraws: ['r'],
  advances: ['r'],
  managers: ['r'],
  recommendations: ['r'],
  push_campaigns: ['r'],
  // staff: [],
  users: ['r'],
  // platform: [],
} as UserPermissions;

const businessesHeadManagerObject = {
  ...(fullStaffPermissions as UserPermissions),
  orders: ['r'],
  // couriers: [],
  // consumers: [],
  account_manager: ['c', 'r', 'u', 'd'],
  businesses: ['c', 'r', 'u', 'd'],
  menu: ['c', 'r', 'u', 'd'],
  // chats: [],
  invoices: ['r'],
  withdraws: ['r'],
  advances: ['r'],
  managers: ['c', 'r', 'u', 'd'],
  recommendations: ['c', 'r', 'u', 'd'],
  // push_campaigns: [],
  staff: ['r'],
  users: ['r'],
  // platform: [],
} as UserPermissions;

const businessesManagerObject = {
  ...(fullStaffPermissions as UserPermissions),
  orders: ['r'],
  // couriers: [],
  // consumers: [],
  account_manager: ['c', 'r'],
  businesses: ['c', 'r', 'u', 'd'],
  menu: ['c', 'r', 'u', 'd'],
  // chats: [],
  invoices: ['r'],
  withdraws: ['r'],
  advances: ['r'],
  managers: ['c', 'r', 'u', 'd'],
  recommendations: ['c', 'r', 'u', 'd'],
  // push_campaigns: [],
  // staff: [],
  users: ['r'],
  // platform: [],
} as UserPermissions;

const viewerObject = (() => {
  const permissions = {} as UserPermissions;
  Object.keys(fullStaffPermissions).forEach((subject) => {
    permissions[subject] = ['c', 'r', 'u', 'd'];
  });
  return permissions;
})();

export const getGenericModePermissions = (
  mode: GenericMode
): UserPermissions => {
  if (mode === 'owner') return backofficeOwnerObject;
  else if (mode === 'orders-manager') return ordersManagerObject;
  else if (mode === 'consumers-manager') return consumersManagerObject;
  else if (mode === 'couriers-manager') return couriersManagerObject;
  else if (mode === 'businesses-manager') return businessesManagerObject;
  else if (mode === 'businesses-account-manager')
    return businessesHeadManagerObject;
  else if (mode === 'viewer') return viewerObject;
  else {
    return fullStaffPermissions as UserPermissions;
  }
};

export const getGenericModeRole = (
  permissions: UserPermissions
): GenericMode => {
  if (isEqual(permissions, backofficeOwnerObject)) return 'owner';
  else if (isEqual(permissions, ordersManagerObject)) return 'orders-manager';
  else if (isEqual(permissions, consumersManagerObject))
    return 'consumers-manager';
  else if (isEqual(permissions, couriersManagerObject))
    return 'couriers-manager';
  else if (isEqual(permissions, businessesManagerObject))
    return 'businesses-manager';
  else if (isEqual(permissions, businessesHeadManagerObject))
    return 'businesses-account-manager';
  else if (isEqual(permissions, viewerObject)) return 'viewer';
  else return 'custom';
};
