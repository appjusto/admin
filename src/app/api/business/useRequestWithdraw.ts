import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useRequestWithdraw = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: requestWithdraw, mutationResult: requestWithdrawResult } =
    useCustomMutation(
      (amount: number) => api.business().requestWithdraw(businessId!, amount),
      'requestWithdraw',
      false,
      false
    );
  // return
  return { requestWithdraw, requestWithdrawResult };
};
