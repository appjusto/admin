import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useComplementImage = (
  complementId: string | undefined,
  enabled: boolean = true
) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  // query
  const getComplementImageURL = () => {
    if (!complementId) return null;
    return api.business().getComplementImageURL(businessId, complementId);
  };
  const { data } = useQuery(
    ['complement:image', complementId],
    getComplementImageURL,
    {
      enabled,
    }
  );
  // result
  return data;
};
