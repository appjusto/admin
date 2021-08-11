import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useComplementImage = (complementId: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  // query
  const getComplementImageURL = () =>
    api.business().getComplementImageURL(businessId, complementId);
  const { data } = useQuery(['complement:image', complementId], getComplementImageURL);
  // result
  return data;
};
