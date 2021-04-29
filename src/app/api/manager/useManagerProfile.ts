import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUserEmail, useContextFirebaseUserId } from 'app/state/auth/context';
import { ManagerProfile, WithId } from 'appjusto-types';
import React from 'react';

export const useManagerProfile = () => {
  // contex
  const api = useContextApi();
  const id = useContextFirebaseUserId();
  const email = useContextFirebaseUserEmail();
  const { isBackofficeUser } = useContextAgentProfile();

  // state
  const [managerEmail, setManagerEmail] = React.useState<string | undefined | null>();
  const [manager, setManager] = React.useState<WithId<ManagerProfile> | undefined | null>();

  // side effects
  // observe profile for no regular users
  React.useEffect(() => {
    if (!isBackofficeUser && id) {
      return api.manager().observeProfile(id, setManager);
    }
  }, [api, id, isBackofficeUser]);

  // observe profile for backoffice users
  React.useEffect(() => {
    if (managerEmail === null) setManager(null);
    if (isBackofficeUser && managerEmail)
      return api.manager().observeProfileByEmail(managerEmail, setManager);
  }, [api, isBackofficeUser, managerEmail]);

  // create profile for regular and backoffice users
  // if manager is null for backoffice purposes, the createProfile func
  // will check the manager existence before create a new one
  React.useEffect(() => {
    if (!id || !email) return;
    if (manager === null) {
      api.manager().createProfile(id, email);
    }
  }, [id, email, manager, api]);

  // return
  return { manager, setManagerEmail };
};
