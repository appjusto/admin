import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

interface AllocationData {
  orderId: string;
  courierId: string;
}

export const useCourierManualAllocation = () => {
  // context
  const api = useContextApi();
  // mutations
  const [courierManualAllocation, allocationResult] = useMutation(async (data: AllocationData) =>
    api.courier().courierManualAllocation(data.orderId, data.courierId)
  );
  // return
  return { courierManualAllocation, allocationResult };
};
