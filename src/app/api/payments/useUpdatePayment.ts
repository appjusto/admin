import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';

export const useUpdatePayment = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: updatePayment, mutationResult: updatePaymentResult } =
    useCustomMutation(
      async (data: {
        paymentId: string;
        from?: 'platform' | 'business';
        value: number;
      }) => api.payments().updatePayment(data.paymentId, data.from, data.value),
      'updatePayment'
    );
  // result
  return {
    updatePayment,
    updatePaymentResult,
  };
};
