import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useProduct = (businessId: string | undefined, productId: string) => {
  // context
  const api = useContextApi();
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  const [isValid, setIsValid] = React.useState(true);
  // side effects
  React.useEffect(() => {
    if (!businessId || productId === 'new') return;
    return api.business().observeProduct(businessId, productId, setProduct);
  }, [api, businessId, productId]);

  React.useEffect(() => {
    if (product?.id && !product.name) {
      setIsValid(false);
    }
  }, [product]);
  // result
  return { product, isValid };
};
