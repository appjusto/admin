import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';

export const useProducts = () => {
  const api = useApi()!;
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);
  React.useEffect(() => {
    return api.menu().observeProducts('default', setProducts);
  }, [api]);
  return products;
};
