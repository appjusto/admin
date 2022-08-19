import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useConsumerProfilePictures = (
  consumerId?: string,
  isActive?: boolean,
  selfieSize: string = '_160x160',
  documentSize: string = '_160x160'
) => {
  // context
  const api = useContextApi();
  // mutations
  const getSelfieImageURL = () => {
    if (!isActive) return;
    if (!consumerId) return;
    return api.consumer().getConsumerProfilePictureURL(consumerId, selfieSize);
  };
  const { data: selfie } = useQuery(
    ['consumer:selfie', consumerId, isActive],
    getSelfieImageURL
  );
  const getDocImageURL = () => {
    if (!isActive) return;
    if (!consumerId) return;
    return api
      .consumer()
      .getConsumerDocumentPictureURL(consumerId, documentSize);
  };
  const { data: document } = useQuery(
    ['consumer:document', consumerId, isActive],
    getDocImageURL
  );
  // result
  return { selfie, document };
};
