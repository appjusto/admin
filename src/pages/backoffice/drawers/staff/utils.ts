import { BackofficePermissions } from '@appjusto/types';

export type GenericMode =
  | 'owner'
  | 'orders-manager'
  | 'couriers-manager'
  | 'consumers-manager'
  | 'businesses-manager'
  | 'viewer'
  | 'custom';

export const getGenericModePermissions = (mode: GenericMode): BackofficePermissions => {
  if (mode === 'owner') {
    return {
      orders: ['read', 'write', 'delete'],
      couriers: ['read', 'write', 'delete'],
      consumers: ['read', 'write', 'delete'],
      businesses: ['read', 'write', 'delete'],
      chats: ['read', 'write', 'delete'],
      invoices: ['read', 'write', 'delete'],
      withdraws: ['read', 'write', 'delete'],
      advances: ['read', 'write', 'delete'],
      managers: ['read', 'write', 'delete'],
      recommendations: ['read', 'write', 'delete'],
      staff: ['read', 'write', 'delete'],
      users: ['read', 'write', 'delete'],
      platform: ['read', 'write', 'delete'],
    };
  } else if (mode === 'orders-manager') {
    return {
      orders: ['read', 'write'],
      couriers: ['read', 'write'],
      consumers: ['read'],
      businesses: ['read', 'write'],
      chats: ['read'],
      invoices: ['read'],
      withdraws: ['read'],
      advances: ['read'],
      managers: ['read', 'write'],
      recommendations: ['read', 'write'],
      staff: [],
      users: ['read'],
      platform: [],
    };
  } else if (mode === 'consumers-manager') {
    return {
      orders: ['read'],
      couriers: [],
      consumers: ['read', 'write'],
      businesses: ['read'],
      chats: ['read'],
      invoices: ['read'],
      withdraws: ['read'],
      advances: ['read'],
      managers: ['read'],
      recommendations: ['read', 'write'],
      staff: [],
      users: ['read'],
      platform: [],
    };
  } else if (mode === 'couriers-manager') {
    return {
      orders: ['read'],
      couriers: ['read', 'write'],
      consumers: [],
      businesses: ['read'],
      chats: ['read'],
      invoices: ['read'],
      withdraws: ['read'],
      advances: ['read'],
      managers: ['read'],
      recommendations: ['read'],
      staff: [],
      users: ['read'],
      platform: [],
    };
  } else if (mode === 'businesses-manager') {
    return {
      orders: ['read'],
      couriers: [],
      consumers: [],
      businesses: ['read', 'write'],
      chats: ['read'],
      invoices: ['read'],
      withdraws: ['read'],
      advances: ['read'],
      managers: ['read'],
      recommendations: ['read', 'write'],
      staff: [],
      users: ['read'],
      platform: [],
    };
  } else if (mode === 'viewer') {
    return {
      orders: ['read'],
      couriers: ['read'],
      consumers: ['read'],
      businesses: ['read'],
      chats: ['read'],
      invoices: ['read'],
      withdraws: ['read'],
      advances: ['read'],
      managers: ['read'],
      recommendations: ['read'],
      staff: ['read'],
      users: ['read'],
      platform: ['read'],
    };
  } else {
    return {
      orders: [],
      couriers: [],
      consumers: [],
      businesses: [],
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
