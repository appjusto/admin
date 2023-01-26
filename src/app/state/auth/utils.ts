import { UserPermissions } from '@appjusto/types';
import { FullPermissions } from './types';

export const businessOwnerObject = {
  advances: ['c', 'r', 'u'],
  businesses: ['c', 'r', 'u', 'd'],
  chats: ['c', 'r', 'u'],
  invoices: ['r', 'u'],
  managers: ['c', 'r', 'u', 'd'],
  menu: ['c', 'r', 'u', 'd'],
  orders: ['r', 'u'],
  withdraws: ['c', 'r', 'u'],
} as Partial<FullPermissions>;

export const businessManagerObject = {
  advances: ['c', 'r', 'u'],
  businesses: ['r', 'u'],
  chats: ['c', 'r', 'u'],
  invoices: ['r', 'u'],
  managers: [
    { rule: 'c', conditions: { role: 'collaborator' } },
    'r',
    { rule: 'u', conditions: { role: 'collaborator' } },
    { rule: 'd', conditions: { role: 'collaborator' } },
  ],
  menu: ['c', 'r', 'u', 'd'],
  orders: ['r', 'u'],
  withdraws: ['c', 'r', 'u'],
} as Partial<FullPermissions>;

export const businessCollaboratorObject = {
  advances: [],
  businesses: ['r', { rule: 'u', conditions: ['status'] }],
  chats: ['c', 'r', 'u'],
  invoices: ['r'],
  managers: [],
  menu: ['r', 'u'],
  orders: ['r', 'u'],
  withdraws: [],
} as Partial<FullPermissions>;

export const fullStaffPermissions = {
  orders: [],
  account_manager: [],
  businesses: [],
  menu: [],
  couriers: [],
  consumers: [],
  chats: [],
  invoices: [],
  withdraws: [],
  advances: [],
  managers: [],
  recommendations: [],
  push_campaigns: [],
  staff: [],
  users: [],
  platform: [],
  banners: [],
} as FullPermissions;

export const getStaffUIConditions = (
  userId: string,
  permissions: UserPermissions
): FullPermissions => {
  let result = { ...fullStaffPermissions, ...permissions } as FullPermissions;
  Object.keys(permissions).forEach((key) => {
    if (key === 'orders') {
      let keyPermissions = permissions[key].map((rule) => {
        if (rule !== 'r') return { rule, conditions: { 'staff.id': userId } };
        else return rule;
      });
      result.orders = keyPermissions;
    }
  });
  return result;
};
