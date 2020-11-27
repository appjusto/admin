import { useApi } from 'app/api/context';
import { useBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useProductImageURL = (productId: string) => {
  const api = useApi();
  const businessId = useBusinessId();

  const getProductURL = (key: string) => api.menu().getProductURL(businessId, productId);
  return useQuery(['product:image', productId], getProductURL, {
    enabled: productId !== 'new',
  });
};
