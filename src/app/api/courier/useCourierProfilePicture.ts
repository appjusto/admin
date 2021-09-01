import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useCourierProfilePicture = (
  courierId?: string,
  size: string = '_160x160',
  active: boolean = true
) => {
  // context
  const api = useContextApi();
  // mutations
  const getSelfieImageURL = () => {
    if (active) return api.courier().getCourierProfilePictureURL(courierId!, size);
    else return null;
  };
  const { data: selfie } = useQuery(['courier:selfie', courierId], getSelfieImageURL);
  // result
  return selfie;
};
