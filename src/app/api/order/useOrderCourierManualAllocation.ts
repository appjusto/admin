import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

interface AllocationData {
  orderId: string;
  courierId: string;
  comment: string;
}

export const useOrderCourierManualAllocation = () => {
  // context
  const api = useContextApi();
  // mutations
  const [courierManualAllocation, allocationResult] = useMutation(async (data: AllocationData) =>
    api.order().courierManualAllocation(data.orderId, data.courierId, data.comment)
  );
  // return
  return { courierManualAllocation, allocationResult };
};
