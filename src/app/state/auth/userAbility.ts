import { CRUD, UserPermissions } from '@appjusto/types';
import { Ability, AbilityOptionsOf, defineAbility, detectSubjectType } from '@casl/ability';
import { AdminRole } from './context';
import {
  AdminPermissionObject,
  businessCollaboratorObject,
  businessManagerObject,
  businessOwnerObject,
} from './utils';

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
//     "uGxPaBFKWq9PBLYhEP7X": "owner" | "manager" | "collaborator"
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

const options: AbilityOptionsOf<AppAbility> = {
  detectSubjectType: (subject) => {
    if (subject && typeof subject === 'object' && subject.kind) {
      return subject.kind;
    }
    return detectSubjectType(subject);
  },
};

const ruleParser = (r: CRUD): Actions => {
  switch (r) {
    case 'c':
      return 'create';
    case 'r':
      return 'read';
    case 'u':
      return 'update';
    case 'd':
      return 'delete';
  }
};

export const defineUserAbility = (permissions: UserPermissions | AdminRole) => {
  return defineAbility<AppAbility>((can) => {
    // helper
    const defineAbilityByPermissionsObject = (
      permissionsObject: AdminPermissionObject | UserPermissions
    ) => {
      Object.keys(permissionsObject).forEach((subject) => {
        permissionsObject[subject].forEach((permission) => {
          if (typeof permission === 'object') {
            can(ruleParser(permission.rule), subject, permission.conditions);
          } else can(ruleParser(permission), subject);
        });
      });
    };
    if (typeof permissions === 'object') {
      defineAbilityByPermissionsObject(permissions);
    } else if (permissions === 'owner') {
      defineAbilityByPermissionsObject(businessOwnerObject);
    } else if (permissions === 'manager') {
      defineAbilityByPermissionsObject(businessManagerObject);
    } else if (permissions === 'collaborator') {
      defineAbilityByPermissionsObject(businessCollaboratorObject);
    }
  }, options);
};
