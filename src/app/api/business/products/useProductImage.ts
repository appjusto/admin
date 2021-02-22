import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useProductImage = (productId: string) => {
  const api = useContextApi();
  const businessId = useContextBusinessId()!;

  const getProductImageURL = (key: string) =>
    api.business().getProductImageURL(businessId, productId, '1008x720');
  const { data } = useQuery(['product:image', productId], getProductImageURL, {
    enabled: productId !== 'new',
  });
  return data;
};
