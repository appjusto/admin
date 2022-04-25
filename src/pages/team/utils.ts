import { UserPermissions } from '@appjusto/types';
import { isEqual } from 'lodash';

export type ManagerBasicRole = 'owner' | 'manager' | 'collaborator';

const ownerObject = {
  advances: ['create', 'read', 'update'],
  businesses: ['create', 'read', 'update', 'delete'],
  chats: ['create', 'read', 'update'],
  invoices: ['read', 'update'],
  managers: ['create', 'read', 'update', 'delete'],
  menu: ['create', 'read', 'update', 'delete'],
  orders: ['read', 'update'],
  withdraws: ['create', 'read', 'update'],
} as UserPermissions;

const managerObject = {
  advances: ['create', 'read', 'update'],
  businesses: ['read', 'update'],
  chats: ['create', 'read', 'update'],
  invoices: ['read', 'update'],
  managers: [],
  menu: ['create', 'read', 'update', 'delete'],
  orders: ['read', 'update'],
  withdraws: ['create', 'read', 'update'],
} as UserPermissions;

const collaboratorObject = {
  advances: [],
  businesses: ['read', 'update'],
  chats: ['create', 'read', 'update'],
  invoices: ['read'],
  managers: [],
  menu: ['read', 'update'],
  orders: ['read', 'update'],
  withdraws: [],
} as UserPermissions;

export const getBusinessManagerPermissionsObject = (mode: ManagerBasicRole): UserPermissions => {
  if (mode === 'owner') return ownerObject;
  else if (mode === 'manager') return managerObject;
  else return collaboratorObject;
};

export const getBusinessManagerBasicRole = (permissions: UserPermissions): ManagerBasicRole => {
  if (isEqual(permissions, ownerObject)) return 'owner';
  else if (isEqual(permissions, managerObject)) return 'manager';
  else return 'collaborator';
};
