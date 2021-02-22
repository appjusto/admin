import { useContextBusinessId } from 'app/state/business/context';
import { Category } from 'appjusto-types';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useContextApi } from '../../../state/api/context';

export const useCategory = (id: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const isNew = id === 'new';
  const idRef = React.useRef(isNew ? api.business().createCategoryRef(businessId) : id);
  const categoryId = idRef.current;

  // queries
  const fetchCategory = () => api.business().fetchCategory(businessId, categoryId);
  const fetchResult = useQuery(['category', categoryId], fetchCategory, { enabled: !isNew });

  // mutations
  const [createCategory, createResult] = useMutation(async (category: Category) =>
    api.business().createCategory(businessId, categoryId, category)
  ).data;
  const [updateCategory, updateResult] = useMutation(async (category: Partial<Category>) =>
    api.business().updateCategory(businessId, categoryId, category)
  );
  const [deleteCategory] = useMutation(async () =>
    api.business().deleteCategory(businessId, categoryId)
  );
  const saveCategory = isNew ? createCategory : updateCategory;
  const result = createResult || updateResult;
  // return
  return {
    category: fetchResult.data,
    id: categoryId,
    createCategory,
    updateCategory,
    deleteCategory,
    saveCategory,
    result,
  };
};
