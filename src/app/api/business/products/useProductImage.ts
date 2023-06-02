import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useQuery } from 'react-query';

export const useProductImage = (
  productId: string,
  imageDim: string,
  enabled: boolean
) => {
  const api = useContextApi();
  const businessId = useContextBusinessId()!;

  const getProductImageURL = () =>
    api.business().getProductImageURL(businessId, productId, imageDim);
  const { data } = useQuery(['product:image', productId], getProductImageURL, {
    enabled,
  });
  return data;
};
