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
    async (data: { simulationId: string; amount: number; fee: number }) =>
      api
        .business()
        .advanceReceivables(
          businessId!,
          data.simulationId,
          data.amount,
          data.fee
        ),
    'advanceReceivables',
    false,
    false
  );
  // return
  return { advanceReceivables, advanceReceivablesResult };
};
