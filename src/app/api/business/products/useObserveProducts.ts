import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../../../state/api/context';

export const useObserveProducts = (businessId: string | undefined) => {
  // context
  const api = useApi();

  // state
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeProducts(businessId, setProducts);
  }, [api, businessId]);

  // return
  return products;
};
