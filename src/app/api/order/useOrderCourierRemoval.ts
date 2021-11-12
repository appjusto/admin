import { useContextApi } from 'app/state/api/context';
import { Issue, WithId } from 'appjusto-types';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface RemovalData {
  orderId: string;
  //courierId: string;
  issue: WithId<Issue>;
  comment?: string;
}

export const useOrderCourierRemoval = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutateAsync: courierManualRemoval, mutationResult: removalResult } = useCustomMutation(
    async (data: RemovalData) =>
      api.order().courierManualRemoval(data.orderId, data.issue, data.comment),
    'courierManualRemoval'
  );
  // return
  return { courierManualRemoval, removalResult };
};
