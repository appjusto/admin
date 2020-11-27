import React from 'react';
import { useBusinessId } from 'app/state/business/context';
import { Category } from 'appjusto-types';
import { useMutation, useQuery } from 'react-query';
import { useApi } from '../../context';

export const useCategory = (id: string) => {
  // context
  const api = useApi();
  const businessId = useBusinessId();
  const isNew = id === 'new';
  const idRef = React.useRef(isNew ? api.menu().createCategoryRef(businessId) : id);
  const categoryId = idRef.current;

  // queries
  const fetchCategory = (key: string) => api.menu().fetchCategory(businessId, categoryId);
  const fetchResult = useQuery(['category', categoryId], fetchCategory, { enabled: !isNew });

  // mutations
  const [createCategory, createResult] = useMutation(async (category: Category) =>
    api.menu().createCategory(businessId, categoryId, category)
  );
  const [updateCategory, updateResult] = useMutation(async (category: Partial<Category>) =>
    api.menu().updateCategory(businessId, categoryId, category)
  );
  const saveCategory = isNew ? createCategory : updateCategory;
  const result = createResult || updateResult;
  // return
  return {
    category: fetchResult.data,
    id: categoryId,
    createCategory,
    updateCategory,
    saveCategory,
    result,
  };
};
