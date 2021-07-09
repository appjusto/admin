import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useCourierProfilePictures = (
  courierId?: string,
  selfieSize: string = '_160x160',
  documentSize: string = '_160x160'
) => {
  // context
  const api = useContextApi();
  // mutations
  const getSelfieImageURL = () => {
    if (!courierId) return;
    return api.courier().getCourierProfilePictureURL(courierId, selfieSize);
  };
  const { data: selfie } = useQuery(['courier:selfie', courierId], getSelfieImageURL);
  const getDocImageURL = () => {
    if (!courierId) return;
    return api.courier().getCourierDocumentPictureURL(courierId, documentSize);
  };
  const { data: document } = useQuery(['courier:document', courierId], getDocImageURL);
  // result
  return { selfie, document };
};
