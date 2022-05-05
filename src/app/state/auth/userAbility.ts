import { AdminRole, CRUD, UserPermissions } from '@appjusto/types';
import { Ability, AbilityOptionsOf, defineAbility, detectSubjectType } from '@casl/ability';
import {
  AdminPermissionObject,
  businessCollaboratorObject,
  businessManagerObject,
  businessOwnerObject,
} from './utils';

// const staffClaim = {
//   "orders": ["c", "r", "u", "d"],
//   "couriers": ["c", "r", "u", "d"],
//   "consumers": ["c", "r", "u", "d"],
//   "businesses": ["c", "r", "u", "d"],
//   "menu": ["c", "r", "u", "d"],
//   "chats": ["c", "r", "u", "d"],
//   "invoices": ["c", "r", "u", "d"],
//   "withdraws": ["c", "r", "u", "d"],
//   "advances": ["c", "r", "u", "d"],
//   "managers": ["c", "r", "u", "d"],
//   "recommendations": ["c", "r", "u", "d"],
//   "staff": ["c", "r", "u", "d"],
//   "users": ["c", "r", "u", "d"],
//   "platform": ["c", "r", "u", "d"]
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
