import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useGetOutsourceDeliveryQuotation = (orderId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: getOutsourceDeliveryQuotation,
    mutationResult: outsourceDeliveryQuotationResult,
  } = useCustomMutation(
    async () =>
      orderId ? api.order().getOutsourceDeliveryQuotation(orderId) : null,
    'getOutsourceDeliveryQuotation'
  );
  // return
  return {
    getOutsourceDeliveryQuotation,
    outsourceDeliveryQuotationResult,
  };
};
