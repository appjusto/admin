import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

interface ReleaseData {
  courierId: string;
  comment: string;
}

export const useReleaseCourier = () => {
  // contex
  const api = useContextApi();
  // mutations
  const [releaseCourier, releaseCourierResult] = useMutation(async (data: ReleaseData) =>
    api.courier().releaseCourier(data)
  );
  // return
  return { releaseCourier, releaseCourierResult };
};
