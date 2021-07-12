import { useContextApi } from 'app/state/api/context';
import { Issue, WithId } from 'appjusto-types';
import { useMutation } from 'react-query';

interface RemovalData {
  orderId: string;
  courierId: string;
  issue: WithId<Issue>;
  comment?: string;
}

export const useOrderCourierRemoval = () => {
  // context
  const api = useContextApi();
  // mutations
  const [courierManualRemoval, removalResult] = useMutation(async (data: RemovalData) =>
    api.order().courierManualRemoval(data.orderId, data.courierId, data.issue, data.comment)
  );
  // return
  return { courierManualRemoval, removalResult };
};
