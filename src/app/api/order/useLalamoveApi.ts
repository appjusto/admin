import { Order, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useLalamoveApi = (order?: WithId<Order> | null) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: getOrderQuotation,
    mutationResult: getOrderQuotationResult,
  } = useCustomMutation(async () => {
    if (!order) return;
    const response = await api.order().getOrderQuotation(order.id);
    console.log(response.data);
    return response.data;
  }, 'getOrderQuotation');
  // result
  return { getOrderQuotation, getOrderQuotationResult };
};
