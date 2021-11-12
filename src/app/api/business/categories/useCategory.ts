import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextBusinessId } from 'app/state/business/context';
import { Category } from 'appjusto-types';
import React from 'react';
import { useQuery } from 'react-query';
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
  const { mutateAsync: createCategory, mutationResult: createResult } = useCustomMutation(
    async (category: Category) => api.business().createCategory(businessId, categoryId, category),
    'createCategory'
  );
  const { mutateAsync: updateCategory, mutationResult: updateResult } = useCustomMutation(
    async (category: Partial<Category>) =>
      api.business().updateCategory(businessId, categoryId, category),
    'updateCategory'
  );
  const { mutateAsync: deleteCategory } = useCustomMutation(
    async () => api.business().deleteCategory(businessId, categoryId),
    'deleteCategory'
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
