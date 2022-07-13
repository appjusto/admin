import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface AllocationData {
  orderId: string;
  courierId?: string;
  courierCode?: string;
  comment: string;
}

export const useOrderCourierManualAllocation = () => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: courierManualAllocation,
    mutationResult: allocationResult,
  } = useCustomMutation(
    async (data: AllocationData) =>
      api.order().courierManualAllocation(data.orderId, data.courierId, data.courierCode, data.comment),
    'courierManualAllocation'
  );
  // return
  return { courierManualAllocation, allocationResult };
};
