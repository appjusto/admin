import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUserEmail, useContextFirebaseUserId } from 'app/state/auth/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';
import { useFirebaseUserRole } from '../auth/useFirebaseUserRole';

export const useManagerProfile = () => {
  // contex
  const api = useContextApi();
  const id = useContextFirebaseUserId();
  const email = useContextFirebaseUserEmail();
  const { isBackofficeUser } = useFirebaseUserRole();

  // state
  const [managerEmail, setManagerEmail] = React.useState<string | undefined | null>(null);
  const [manager, setManager] = React.useState<WithId<ManagerProfile> | undefined | null>();

  // side effects
  // observe profile for no backoffice users
  React.useEffect(() => {
    if (!isBackofficeUser && id) {
      return api.manager().observeProfile(id, setManager);
    }
  }, [api, id, isBackofficeUser]);
  // observe profile
  React.useEffect(() => {
    if (isBackofficeUser && managerEmail) {
      return api.manager().observeProfileByEmail(managerEmail, setManager);
    }
  }, [api, isBackofficeUser, managerEmail]);

  // create profile for regular users if it doesn't exist
  React.useEffect(() => {
    if (!id || !email) return;
    if (!isBackofficeUser && manager === null) {
      api.manager().createProfile(id, email);
    }
  }, [id, email, isBackofficeUser, manager, api]);
  // return
  return { manager, setManagerEmail };
};
