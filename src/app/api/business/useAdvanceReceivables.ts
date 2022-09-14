import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useAdvanceReceivables = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: advanceReceivables,
    mutationResult: advanceReceivablesResult,
  } = useCustomMutation(
    async (simulationId: string) =>
      api.business().advanceReceivables(businessId!, simulationId),
    'advanceReceivables',
    false,
    false
  );
  // return
  return { advanceReceivables, advanceReceivablesResult };
};
