import { BackofficePermissions } from '@appjusto/types';
import { defineAbility } from '@casl/ability';

export const defineUserAbility = (permissions: BackofficePermissions) => {
  return defineAbility((can) => {
    Object.keys(permissions).forEach((key) => {
      permissions[key].forEach((rule) => can(rule, key));
    });
  });
};
