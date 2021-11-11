import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useRequestWithdraw = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: requestWithdraw,
    mutationResult: requestWithdrawResult,
  } = useCustomMutation(async (amount: number) =>
    api.business().requestWithdraw(businessId!, amount)
  );
  // return
  return { requestWithdraw, requestWithdrawResult };
};
