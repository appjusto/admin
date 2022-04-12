import { NewAgentData } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useAgent = () => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutateAsync: createAgente, mutationResult: createResult } = useCustomMutation(
    async (agent: NewAgentData) => {
      return api.agent().createAgent(agent);
    },
    'createAgent'
  );
  const { mutateAsync: getAgente, mutationResult: getAgentResult } = useCustomMutation(
    async (agentId: string) => {
      return api.agent().getAgent(agentId);
    },
    'createAgent'
  );
  // return
  return { getAgente, getAgentResult, createAgente, createResult };
};
