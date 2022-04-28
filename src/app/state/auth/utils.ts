import { CRUD } from '@appjusto/types';
import { MongoQuery } from '@casl/ability';

type Rule =
  | {
      rule: CRUD;
      conditions: MongoQuery<string[]>;
    }
  | CRUD;

export type AdminPermissionObject = {
  [key: string]: Rule[];
};

export const businessOwnerObject = {
  advances: ['c', 'r', 'u'],
  businesses: ['c', 'r', 'u', 'd'],
  chats: ['c', 'r', 'u'],
  invoices: ['r', 'u'],
  managers: ['c', 'r', 'u', 'd'],
  menu: ['c', 'r', 'u', 'd'],
  orders: ['r', 'u'],
  withdraws: ['c', 'r', 'u'],
} as AdminPermissionObject;

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
} as AdminPermissionObject;

export const businessCollaboratorObject = {
  advances: [],
  businesses: ['r', { rule: 'u', conditions: ['status', 'keepAlive'] }],
  chats: ['c', 'r', 'u'],
  invoices: ['r'],
  managers: [],
  menu: ['r', 'u'],
  orders: ['r', 'u'],
  withdraws: [],
} as AdminPermissionObject;
