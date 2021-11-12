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
    async (ids: number[]) => api.business().advanceReceivables(businessId!, ids),
    'advanceReceivables'
  );
  // return
  return { advanceReceivables, advanceReceivablesResult };
};
