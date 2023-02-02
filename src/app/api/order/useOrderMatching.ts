import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useOrderMatching = (orderId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: restartMatching, mutationResult: restartResult } =
    useCustomMutation(
      () =>
        api.order().updateOrder(orderId!, { dispatchingStatus: 'scheduled' }),
      'restartMatching',
      false
    );
  // return
  return {
    restartMatching,
    restartResult,
  };
};
