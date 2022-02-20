import { useContextApi } from 'app/state/api/context';
import { OutsourceAccountType, Order } from '@appjusto/types';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useGetOutsourceDelivery = (orderId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: getOutsourceDelivery,
    mutationResult: outsourceDeliveryResult,
  } = useCustomMutation(
    async (data: { accountType?: OutsourceAccountType }) =>
      orderId ? api.order().getOutsourceDelivery(orderId, data.accountType) : null,
    'getOutsourceDelivery'
  );
  const {
    mutateAsync: updateOutsourcingCourierName,
    mutationResult: updateOutsourcingCourierNameResult,
  } = useCustomMutation(async (name: string) => {
    if (!orderId) return null;
    const partialOrder = {
      courier: {
        name,
      },
    } as Partial<Order>;
    return api.order().updateOrder(orderId, partialOrder);
  }, 'updateOutsourcingCourierName');
  // return
  return {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierName,
    updateOutsourcingCourierNameResult,
  };
};
