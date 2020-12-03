import { useApi } from 'app/state/api/context';
import { useBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useProductImageURL = (productId: string) => {
  const api = useApi();
  const businessId = useBusinessId();

  const getProductURL = (key: string) => api.business().getProductURL(businessId, productId);
  return useQuery(['product:image', productId], getProductURL, {
    enabled: productId !== 'new',
  });
};
