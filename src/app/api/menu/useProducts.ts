import { useBusinessId } from 'app/state/business/context';
import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';

export const useProducts = () => {
  const api = useApi()!;
  const businessId = useBusinessId()!;
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);
  React.useEffect(() => {
    return api.menu().observeProducts(businessId, setProducts);
  }, [api, businessId]);
  return products;
};
