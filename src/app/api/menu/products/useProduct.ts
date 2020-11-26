import React from 'react';
import { useBusinessId } from 'app/state/business/context';
import { Product } from 'appjusto-types';
import { useMutation, useQuery } from 'react-query';
import { useApi } from '../../context';

export const useProduct = (id: string) => {
  // context
  const api = useApi();
  const businessId = useBusinessId();
  const isNew = id === 'new';
  const productId = isNew ? api.menu().createProductRef(businessId) : id;

  // state
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // queries
  const fetchProduct = (key: string) => api.menu().fetchProduct(businessId, productId);
  const fetchResult = useQuery(['product', productId], fetchProduct, { enabled: !isNew });

  const getProductURL = (key: string) => api.menu().getProductURL(businessId, productId);
  const fetchProductURL = useQuery(['product:image', productId], getProductURL, {
    enabled: !isNew,
  });

  // mutations
  const [saveProduct, saveResult] = useMutation(async (product: Product) => {
    if (isNew) {
      await api.menu().createProduct(businessId, productId, product);
    } else {
      await api.menu().updateProduct(businessId, productId, product);
    }
  });
  const [uploadPhoto, uploadResult] = useMutation((file: File) => {
    return api.menu().uploadProductPhoto(businessId, productId, file, setUploadProgress);
  });
  const [updateCategory, updateCategoryResult] = useMutation((categoryId: string) =>
    api.menu().updateProductCategory(businessId, productId, categoryId)
  );

  // return
  return {
    product: fetchResult.data,
    image: fetchProductURL.data,
    saveProduct,
    updateCategory,
    uploadPhoto,
    uploadProgress,
    isLoading: saveResult.isLoading || updateCategoryResult.isLoading || uploadResult.isLoading,
    isError: saveResult.isError || updateCategoryResult.isError || uploadResult.isError,
    error: saveResult.error || updateCategoryResult.error || uploadResult.error,
  };
};
