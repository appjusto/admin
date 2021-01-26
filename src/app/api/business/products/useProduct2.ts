import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useProduct = (businessId: string | undefined, productId: string) => {
  // context
  const api = useContextApi();
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  const [isValid, setIsValid] = React.useState(true);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const getImageUrl = React.useCallback(async () => {
    const url = await api.business().getProductImageURL(businessId!, productId);
    setImageUrl(url);
  }, [api, businessId, productId]);
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

  React.useEffect(() => {
    if (product?.imageExists) {
      getImageUrl();
    }
  }, [product, getImageUrl]);
  // result
  return { product, isValid, imageUrl };
};
