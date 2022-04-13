import { NewAgentData, ProfileSituation } from '@appjusto/types';
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
  const { mutateAsync: updateAgenteSituation, mutationResult: updateSituationResult } =
    useCustomMutation(async (data: { agentId: string; situation: ProfileSituation }) => {
      const { agentId, situation } = data;
      return api.agent().updateProfile(agentId, { situation });
    }, 'updateAgenteSituation');
  const { mutateAsync: getAgente, mutationResult: getAgentResult } = useCustomMutation(
    async (agentId: string) => {
      return api.agent().getAgent(agentId);
    },
    'getAgente',
    false,
    true
  );
  // return
  return {
    getAgente,
    getAgentResult,
    createAgente,
    createResult,
    updateAgenteSituation,
    updateSituationResult,
  };
};
