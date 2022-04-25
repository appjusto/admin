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
    };
  } else if (mode === 'orders-manager') {
    return {
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
    };
  } else if (mode === 'consumers-manager') {
    return {
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
    };
  } else if (mode === 'couriers-manager') {
    return {
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
    };
  } else if (mode === 'businesses-manager') {
    return {
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
    };
  } else if (mode === 'viewer') {
    return {
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
    };
  } else {
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

// "orders": ["create", "read", "update", "delete"],
// "couriers": ["create", "read", "update", "delete"],
// "consumers": ["create", "read", "update", "delete"],
// "businesses": ["create", "read", "update", "delete"],
// "menu": ["create", "read", "update", "delete"],
// "chats": ["create", "read", "update", "delete"],
// "invoices": ["create", "read", "update", "delete"],
// "withdraws": ["create", "read", "update", "delete"],
// "advances": ["create", "read", "update", "delete"],
// "managers": ["create", "read", "update", "delete"],
// "recommendations": ["create", "read", "update", "delete"],
// "staff": ["create", "read", "update", "delete"],
// "users": ["create", "read", "update", "delete"],
// "platform": ["create", "read", "update", "delete"]
