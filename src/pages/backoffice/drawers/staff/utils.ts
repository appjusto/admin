import { UserPermissions } from '@appjusto/types';
import { isEqual } from 'lodash';

export type GenericMode =
  | 'owner'
  | 'orders-manager'
  | 'couriers-manager'
  | 'consumers-manager'
  | 'businesses-manager'
  | 'viewer'
  | 'custom';

const backofficeOwnerObject = {
  orders: ['create', 'read', 'update', 'delete'],
  couriers: ['create', 'read', 'update', 'delete'],
  consumers: ['create', 'read', 'update', 'delete'],
  businesses: ['create', 'read', 'update', 'delete'],
  menu: ['create', 'read', 'update', 'delete'],
  chats: ['create', 'read', 'update', 'delete'],
  invoices: ['create', 'read', 'update', 'delete'],
  withdraws: ['create', 'read', 'update', 'delete'],
  advances: ['create', 'read', 'update', 'delete'],
  managers: ['create', 'read', 'update', 'delete'],
  recommendations: ['create', 'read', 'update', 'delete'],
  staff: ['create', 'read', 'update', 'delete'],
  users: ['create', 'read', 'update', 'delete'],
  platform: ['create', 'read', 'update', 'delete'],
} as UserPermissions;

const ordersManagerObject = {
  orders: ['read', 'update'],
  couriers: ['read', 'update'],
  consumers: ['read'],
  businesses: ['read', 'update'],
  menu: ['read'],
  chats: ['read'],
  invoices: ['read'],
  withdraws: ['read'],
  advances: ['read'],
  managers: ['read', 'update'],
  recommendations: ['read', 'update'],
  staff: [],
  users: ['read'],
  platform: [],
} as UserPermissions;

const consumersManagerObject = {
  orders: ['read'],
  couriers: [],
  consumers: ['read', 'update'],
  businesses: ['read'],
  menu: ['read'],
  chats: ['read'],
  invoices: ['read'],
  withdraws: ['read'],
  advances: ['read'],
  managers: ['read'],
  recommendations: ['read', 'update'],
  staff: [],
  users: ['read'],
  platform: [],
} as UserPermissions;

const couriersManagerObject = {
  orders: ['read'],
  couriers: ['read', 'update'],
  consumers: [],
  businesses: ['read'],
  menu: ['read'],
  chats: ['read'],
  invoices: ['read'],
  withdraws: ['read'],
  advances: ['read'],
  managers: ['read'],
  recommendations: ['read'],
  staff: [],
  users: ['read'],
  platform: [],
} as UserPermissions;

const businessesManagerObject = {
  orders: ['read'],
  couriers: [],
  consumers: [],
  businesses: ['create', 'read', 'update', 'delete'],
  menu: ['create', 'read', 'update', 'delete'],
  chats: ['read'],
  invoices: ['read'],
  withdraws: ['read'],
  advances: ['read'],
  managers: ['read'],
  recommendations: ['read', 'update'],
  staff: [],
  users: ['read'],
  platform: [],
} as UserPermissions;

const viewerObject = {
  orders: ['read'],
  couriers: ['read'],
  consumers: ['read'],
  businesses: ['read'],
  menu: ['read'],
  chats: ['read'],
  invoices: ['read'],
  withdraws: ['read'],
  advances: ['read'],
  managers: ['read'],
  recommendations: ['read'],
  staff: ['read'],
  users: ['read'],
  platform: ['read'],
} as UserPermissions;

export const getGenericModePermissions = (mode: GenericMode): UserPermissions => {
  if (mode === 'owner') return backofficeOwnerObject;
  else if (mode === 'orders-manager') return ordersManagerObject;
  else if (mode === 'consumers-manager') return consumersManagerObject;
  else if (mode === 'couriers-manager') return couriersManagerObject;
  else if (mode === 'businesses-manager') return businessesManagerObject;
  else if (mode === 'viewer') return viewerObject;
  else {
    return {
      orders: [],
      couriers: [],
      consumers: [],
      businesses: [],
      menu: [],
      chats: [],
      invoices: [],
      withdraws: [],
      advances: [],
      managers: [],
      recommendations: [],
      staff: [],
      users: [],
      platform: [],
    };
  }
};

export const getGenericModeRole = (permissions: UserPermissions): GenericMode => {
  if (isEqual(permissions, backofficeOwnerObject)) return 'owner';
  else if (isEqual(permissions, ordersManagerObject)) return 'orders-manager';
  else if (isEqual(permissions, consumersManagerObject)) return 'consumers-manager';
  else if (isEqual(permissions, couriersManagerObject)) return 'couriers-manager';
  else if (isEqual(permissions, businessesManagerObject)) return 'businesses-manager';
  else if (isEqual(permissions, viewerObject)) return 'viewer';
  else return 'custom';
};
