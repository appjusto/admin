import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

export const useGetOutsourceDelivery = () => {
  // context
  const api = useContextApi();
  // mutations
  const [getOutsourceDelivery, outsourceDeliveryResult] = useMutation(async (orderId: string) =>
    api.order().getOutsourceDelivery(orderId)
  );
  // return
  return { getOutsourceDelivery, outsourceDeliveryResult };
};
