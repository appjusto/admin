import { useApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useProductImage = (productId: string) => {
  const api = useApi();
  const businessId = useContextBusinessId()!;

  const getProductImageURL = (key: string) => api.business().getProductImageURL(businessId, productId);
  const { data } = useQuery(['product:image', productId], getProductImageURL, {
    enabled: productId !== 'new',
  });
  return data;
};
