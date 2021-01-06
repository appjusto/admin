import { useContextBusinessId } from 'app/state/business/context';
import { Product } from 'appjusto-types';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useContextApi } from '../../../state/api/context';
import { useProductImage } from './useProductImage';

export const useProduct = (id: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const isNew = id === 'new';
  const idRef = React.useRef(isNew ? api.business().createProductRef(businessId) : id);
  const productId = idRef.current;

  // state
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // queries
  const fetchProduct = (key: string) => api.business().fetchProduct(businessId, productId);
  const fetchResult = useQuery(['product', productId], fetchProduct, { enabled: !isNew });

  const image = useProductImage(productId);

  // mutations
  const [createProduct, createResult] = useMutation(async (product: Product) =>
    api.business().createProduct(businessId, productId, product)
  );
  const [updateProduct, updateResult] = useMutation(async (product: Partial<Product>) =>
    api.business().updateProduct(businessId, productId, product)
  );
  const [uploadPhoto, uploadResult] = useMutation((file: File) => {
    return api.business().uploadProductPhoto(businessId, productId, file, setUploadProgress);
  });
  const result = createResult || updateResult || uploadResult;
  const saveProduct = isNew ? createProduct : updateProduct;

  // return
  return {
    product: fetchResult.data,
    id: productId,
    isNew,
    image,
    createProduct,
    updateProduct,
    saveProduct,
    uploadPhoto,
    uploadProgress,
    result,
  };
};
