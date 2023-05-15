import { HubsterStore } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useHubsterStore = () => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: updateHubsterStore,
    mutationResult: updateHubsterStoreResult,
  } = useCustomMutation(
    async (data: { docId?: string; changes: HubsterStore }) => {
      const { docId, changes } = data;
      if (!docId) {
        return await api.business().createHubsterStore(changes);
      }
      return await api.business().updateHubsterStore(docId, changes);
    },
    'updateHubsterStore'
  );
  // return
  return {
    updateHubsterStore,
    updateHubsterStoreResult,
  };
};
