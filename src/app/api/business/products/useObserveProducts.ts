import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveProducts = (businessId: string | undefined) => {
  // context
  const api = useContextApi();

  // state
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeProducts(businessId, setProducts);
    return () => unsub();
  }, [api, businessId]);
  // return
  return products;
};
