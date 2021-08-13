import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveProduct = (
  businessId: string | undefined,
  productId: string,
  imageDim: string
) => {
  // context
  const api = useContextApi();
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  const [isValid, setIsValid] = React.useState(true);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  // handlers
  const getImageUrl = React.useCallback(async () => {
    const url = await api.business().getProductImageURL(businessId!, productId, imageDim);
    setImageUrl(url);
  }, [api, businessId, imageDim, productId]);
  // side effects
  React.useEffect(() => {
    if (productId === 'new') {
      setImageUrl(null);
      return;
    }
    if (!businessId) return;
    const unsub = api.business().observeProduct(businessId, productId, setProduct);
    return () => unsub();
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
  }, [product?.imageExists, getImageUrl]);
  // result
  return { product, isValid, imageUrl };
};
