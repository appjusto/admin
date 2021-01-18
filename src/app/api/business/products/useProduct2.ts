import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useProduct = (businessId: string | undefined, productId: string) => {
  // context
  const api = useContextApi();
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  // side effects
  React.useEffect(() => {
    if (!businessId || productId === 'new') return;
    return api.business().observeProduct(businessId, productId, setProduct);
  }, [api, businessId, productId]);
  // result
  return product;
};
