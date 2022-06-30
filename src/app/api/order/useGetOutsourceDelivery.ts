import { Order, OutsourceAccountType } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
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
    mutateAsync: updateOutsourcingCourierInfos,
    mutationResult: updateOutsourcingCourierInfosResult,
  } = useCustomMutation(async (data: {name: string, phone?: string}) => {
    const { name, phone } = data;
    if (!orderId) return null;
    const partialOrder = {
      courier: {
        name,
        phone: phone ?? null
      },
    } as Partial<Order>;
    return api.order().updateOrder(orderId, partialOrder);
  }, 'updateOutsourcingCourierInfos');
  // return
  return {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierInfos,
    updateOutsourcingCourierInfosResult,
  };
};
