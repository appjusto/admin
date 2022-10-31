import { AdminRole, CRUD, UserPermissions } from '@appjusto/types';
import {
  AbilityOptionsOf,
  defineAbility,
  detectSubjectType,
} from '@casl/ability';
import { FirebaseError } from 'firebase/app';
import { Actions, AppAbility, Entities, FullPermissions } from './types';
import {
  businessCollaboratorObject,
  businessManagerObject,
  businessOwnerObject,
  getStaffUIConditions,
} from './utils';

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

export const defineUserAbility = (
  permissions: UserPermissions | AdminRole,
  userId?: string
) => {
  return defineAbility<AppAbility>((can) => {
    // helper
    const defineAbilityByPermissionsObject = (
      permissionsObject: Partial<FullPermissions>
    ) => {
      Object.keys(permissionsObject).forEach((subject) => {
        permissionsObject[subject as Entities]!.forEach((permission) => {
          if (typeof permission === 'object') {
            can(ruleParser(permission.rule), subject, permission.conditions);
          } else can(ruleParser(permission), subject);
        });
      });
    };
    if (typeof permissions === 'object') {
      if (!userId) {
        throw new FirebaseError(
          'define-ability',
          'O Id do usuário não foi encontrado'
        );
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
