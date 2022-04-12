import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useAgents = () => {
  // contex
  const api = useContextApi();
  const { role } = useContextFirebaseUser();
  // state
  const [agents, setAgents] = React.useState<WithId<ManagerProfile>[] | null>();
  // side effects
  React.useEffect(() => {
    if (role !== 'owner') return;
    api.agent().observeAgents(setAgents);
  }, [api, role]);
  // return
  return { agents };
};
