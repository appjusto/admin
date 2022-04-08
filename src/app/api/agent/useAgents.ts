import { WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
// import { useCustomMutation } from '../mutation/useCustomMutation';
import { AgentWithRole } from './types';

export const useAgents = () => {
  // contex
  const api = useContextApi();
  const { role } = useContextFirebaseUser();
  // state
  const [agents, setAgents] = React.useState<WithId<AgentWithRole>[]>();
  // mutations
  // const { mutateAsync: createManager, mutationResult: createResult } = useCustomMutation(
  //   async (managers: NewManagerData[]) => {
  //     const dataWithKey = { key: business?.id!, managers };
  //     return api.manager().createManager(dataWithKey);
  //   },
  //   'createManager'
  // );
  // const { mutateAsync: removeBusinessManager, mutationResult: removeResult } = useCustomMutation(
  //   async (managerEmail: string) => api.business().removeBusinessManager(business!, managerEmail),
  //   'removeBusinessManager',
  //   false
  // );
  // side effects
  React.useEffect(() => {
    if (role !== 'owner') return;
    api.agent().getAgents(setAgents);
  }, [api, role]);
  // return
  return { agents };
};
