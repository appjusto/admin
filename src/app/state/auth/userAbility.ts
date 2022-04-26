import { UserPermissions } from '@appjusto/types';
import { Ability, defineAbility } from '@casl/ability';

// const staffClaim = {
//   "orders": ["create", "read", "update", "delete"],
//   "couriers": ["create", "read", "update", "delete"],
//   "consumers": ["create", "read", "update", "delete"],
//   "businesses": ["create", "read", "update", "delete"],
//   "menu": ["create", "read", "update", "delete"],
//   "chats": ["create", "read", "update", "delete"],
//   "invoices": ["create", "read", "update", "delete"],
//   "withdraws": ["create", "read", "update", "delete"],
//   "advances": ["create", "read", "update", "delete"],
//   "managers": ["create", "read", "update", "delete"],
//   "recommendations": ["create", "read", "update", "delete"],
//   "staff": ["create", "read", "update", "delete"],
//   "users": ["create", "read", "update", "delete"],
//   "platform": ["create", "read", "update", "delete"]
// }

// const managerClaim = {
//   "businesses": {
//     "uGxPaBFKWq9PBLYhEP7X": {
//       "advances": ["create", "read", "update"],
//       "businesses": ["create", "read", "update", "delete"],
//       "chats": ["create", "read", "update"],
//       "invoices": ["read", "update"],
//       "managers": ["create", "read", "update", "delete"],
//       "menu": ["create", "read", "update", "delete"],
//       "orders": ["read", "update"],
//       "withdraws": ["create", "read", "update"]
//     }
//   }
// }

type Actions = 'create' | 'read' | 'update' | 'delete';
type Subjects =
  | 'orders'
  | 'businesses'
  | 'menu'
  | 'couriers'
  | 'consumers'
  | 'chats'
  | 'invoices'
  | 'withdraws'
  | 'advances'
  | 'managers'
  | 'recommendations'
  | 'staff'
  | 'users'
  | 'platform';

export type AppAbility = Ability<[Actions, Subjects | any]>;

export const defineAbilityFor = (permissions: UserPermissions) => {
  return defineAbility<AppAbility>((can) => {
    Object.keys(permissions).forEach((subject) => {
      permissions[subject].forEach((rule: Actions) => can(rule, subject as Subjects));
    });
  });
};
