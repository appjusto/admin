import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useCourierProfilePicture = (courierId?: string, size: string = '_160x160') => {
  // context
  const api = useContextApi();
  // mutations
  const getSelfieImageURL = () => {
    if (!courierId) return;
    return api.courier().getCourierProfilePictureURL(courierId, size);
  };
  const { data: selfie } = useQuery(['courier:selfie', courierId], getSelfieImageURL);
  // result
  return selfie;
};
