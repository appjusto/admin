import { useContextFirebaseUser } from 'app/state/auth/context';
import { Entities } from 'app/state/auth/types';
import React from 'react';

export const useUserCanReadEntity = (entity: Entities) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  // halpers
  const userCanRead = React.useMemo(
    () => userAbility?.can('read', entity),
    [userAbility, entity]
  );
  // return
  return userCanRead;
};
