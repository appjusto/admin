import { Order, OutsourceAccountType } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export type OusourcedResponse = {
  data: {
    lalamoveOrder: {
      quotationId: string;
      priceBreakdown: {
        base: string;
        extraMileage: string;
        totalExcludePriorityFee: string;
        total: string;
        currency: 'BRL';
      };
      driverId: string;
      shareLink: string;
      status: string; //'ASSIGNING_DRIVER',
      distance: { value: string; unit: string };
      stops: [
        {
          coordinates: [Object];
          address: string;
          name: string;
          phone: string;
          id?: string;
        },
        {
          coordinates: [Object];
          address: string;
          name: string;
          phone: string;
          POD: [Object];
          id?: string;
        }
      ];
      id: string;
    } | null;
  };
};

export const useGetOutsourceDelivery = (orderId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: getOutsourceDelivery,
    mutationResult: outsourceDeliveryResult,
  } = useCustomMutation(
    async (data: {
      accountType?: OutsourceAccountType;
      priorityFee?: string;
    }): Promise<OusourcedResponse | null> =>
      orderId
        ? (api
            .order()
            .getOutsourceDelivery(
              orderId,
              data?.accountType,
              data?.priorityFee
            ) as Promise<OusourcedResponse>)
        : null,
    'getOutsourceDelivery'
  );
  const {
    mutateAsync: updateOutsourcingCourierInfos,
    mutationResult: updateOutsourcingCourierInfosResult,
  } = useCustomMutation(async (data: { name: string; phone?: string }) => {
    const { name, phone } = data;
    if (!orderId) return null;
    const partialOrder = {
      courier: {
        name,
        phone: phone ?? null,
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
