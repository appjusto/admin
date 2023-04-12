import { OutsourceAccountType } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useGetUpdateOrder = (orderId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const { mutateAsync: getUpdateOrder, mutationResult: getUpdateOrderResult } =
    useCustomMutation(
      async (data: { accountType: OutsourceAccountType }) =>
        orderId ? api.order().getUpdateOrder(orderId, data.accountType) : null,
      'getUpdateOrder'
    );
  // return
  return {
    getUpdateOrder,
    getUpdateOrderResult,
  };
};
