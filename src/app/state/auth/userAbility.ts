import { AdminRole, CRUD, UserPermissions } from '@appjusto/types';
import { Ability, AbilityOptionsOf, defineAbility, detectSubjectType } from '@casl/ability';
import { FirebaseError } from 'firebase/app';
import {
  businessCollaboratorObject,
  businessManagerObject,
  businessOwnerObject,
  FullPermissions,
  getStaffUIConditions,
} from './utils';

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

export const defineUserAbility = (permissions: UserPermissions | AdminRole, userId?: string) => {
  return defineAbility<AppAbility>((can) => {
    // helper
    const defineAbilityByPermissionsObject = (
      permissionsObject: FullPermissions | UserPermissions
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
      if (!userId) {
        throw new FirebaseError('define-ability', 'O Id do usuário não foi encontrado');
      }
      const fullPermission = getStaffUIConditions(userId, permissions);
      defineAbilityByPermissionsObject(fullPermission);
    } else if (permissions === 'owner') {
      defineAbilityByPermissionsObject(businessOwnerObject);
    } else if (permissions === 'manager') {
      defineAbilityByPermissionsObject(businessManagerObject);
    } else if (permissions === 'collaborator') {
      defineAbilityByPermissionsObject(businessCollaboratorObject);
    }
  }, options);
};
