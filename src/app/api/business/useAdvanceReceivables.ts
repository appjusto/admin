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
    async (data: { ids: number[]; amount: number }) =>
      api.business().advanceReceivables(businessId!, data),
    'advanceReceivables',
    false
  );
  // return
  return { advanceReceivables, advanceReceivablesResult };
};
