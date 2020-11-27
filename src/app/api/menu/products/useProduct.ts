import React from 'react';
import { useBusinessId } from 'app/state/business/context';
import { Product } from 'appjusto-types';
import { useMutation, useQuery } from 'react-query';
import { useApi } from '../../context';
import { useProductImageURL } from './useProductImageURL';

export const useProduct = (id: string) => {
  // context
  const api = useApi();
  const businessId = useBusinessId();
  const isNew = id === 'new';
  const idRef = React.useRef(isNew ? api.menu().createProductRef(businessId) : id);
  const productId = idRef.current;

  // state
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // queries
  const fetchProduct = (key: string) => api.menu().fetchProduct(businessId, productId);
  const fetchResult = useQuery(['product', productId], fetchProduct, { enabled: !isNew });

  const { data: image } = useProductImageURL(productId);

  // mutations
  const [createProduct, createResult] = useMutation(async (product: Product) =>
    api.menu().createProduct(businessId, productId, product)
  );
  const [updateProduct, updateResult] = useMutation(async (product: Partial<Product>) =>
    api.menu().updateProduct(businessId, productId, product)
  );
  const [uploadPhoto, uploadResult] = useMutation((file: File) => {
    return api.menu().uploadProductPhoto(businessId, productId, file, setUploadProgress);
  });
  const result = createResult || updateResult || uploadResult;
  const saveProduct = isNew ? createProduct : updateProduct;

  // return
  return {
    product: fetchResult.data,
    id: productId,
    image,
    createProduct,
    updateProduct,
    saveProduct,
    uploadPhoto,
    uploadProgress,
    result,
  };
};
