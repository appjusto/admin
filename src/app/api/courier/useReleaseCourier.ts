import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

interface ReleaseData {
  courierId: string;
  comment: string;
}

export const useReleaseCourier = () => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutateAsync: releaseCourier, mutationResult: releaseCourierResult } = useCustomMutation(
    async (data: ReleaseData) => api.courier().releaseCourier(data),
    'releaseCourier'
  );
  // return
  return { releaseCourier, releaseCourierResult };
};
