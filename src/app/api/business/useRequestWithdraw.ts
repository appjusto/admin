import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

export const useRequestWithdraw = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const [requestWithdraw, requestWithdrawResult] = useMutation(async (amount: number) =>
    api.business().requestWithdraw(businessId!, amount)
  );
  // return
  return { requestWithdraw, requestWithdrawResult };
};
