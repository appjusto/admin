import { Product, WithId } from '@appjusto/types';
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
  const [product, setProduct] = React.useState<WithId<Product> | null>();
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  // handlers
  const getImageUrl = React.useCallback(async () => {
    const url = await api
      .business()
      .getProductImageURL(businessId!, productId, imageDim);
    setImageUrl(url);
  }, [api, businessId, imageDim, productId]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    if (productId === 'new') {
      setImageUrl(null);
      return;
    }
    const unsub = api
      .business()
      .observeProduct(businessId, productId, setProduct);
    return () => unsub();
  }, [api, businessId, productId]);
  React.useEffect(() => {
    if (!product) return;
    if (product?.imageUrls) {
      setImageUrl(product.imageUrls[0]);
      return;
    } else {
      if (product?.imageExists) {
        getImageUrl();
      }
    }
  }, [product, getImageUrl]);
  // result
  return { product, imageUrl };
};
