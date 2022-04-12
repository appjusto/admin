import { ManagerProfile, NewAgentData, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useAgent = (agentId: string) => {
  // contex
  const api = useContextApi();
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [agent, setAgent] = React.useState<WithId<ManagerProfile> | undefined | null>();
  // mutations
  const { mutateAsync: createAgente, mutationResult: createResult } = useCustomMutation(
    async (agent: NewAgentData) => {
      return api.agent().createAgent(agent);
    },
    'createAgent'
  );
  // side effects
  // observe profile
  React.useEffect(() => {
    if (!isBackofficeUser) return;
    if (!agentId || agentId === 'new') return;
    const unsub = api.agent().observeProfile(agentId, setAgent);
    return () => unsub();
  }, [api, agentId, isBackofficeUser]);
  // return
  return { agent, createAgente, createResult };
};
