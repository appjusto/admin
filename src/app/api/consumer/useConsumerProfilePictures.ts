import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useConsumerProfilePictures = (
  consumerId?: string,
  selfieSize: string = '_160x160',
  documentSize: string = '_160x160'
) => {
  // context
  const api = useContextApi();
  // mutations
  const getSelfieImageURL = () => {
    if (!consumerId) return;
    return api.consumer().getConsumerProfilePictureURL(consumerId, selfieSize);
  };
  const { data: selfie } = useQuery(['consumer:selfie', consumerId], getSelfieImageURL);
  const getDocImageURL = () => {
    if (!consumerId) return;
    return api.consumer().getConsumerDocumentPictureURL(consumerId, documentSize);
  };
  const { data: document } = useQuery(['consumer:document', consumerId], getDocImageURL);
  // result
  return { selfie, document };
};
