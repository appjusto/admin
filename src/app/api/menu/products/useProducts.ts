import { useBusinessId } from 'app/state/business/context';
import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../../context';

export const useProducts = () => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;

  // state
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);

  // side effects
  React.useEffect(() => {
    return api.menu().observeProducts(businessId, setProducts);
  }, [api, businessId]);

  // return
  return products;
};
