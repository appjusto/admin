import { Category } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextBusinessId } from 'app/state/business/context';
import React from 'react';
import { useQuery } from 'react-query';
import { useContextApi } from '../../../state/api/context';

export const useCategory = (id: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const isNew = id === 'new';
  // state
  const [categoryId, setCategoryId] = React.useState<string>(id);

  // queries
  const fetchCategory = () => api.business().fetchCategory(businessId, categoryId);
  const fetchResult = useQuery(['category', categoryId], fetchCategory, { enabled: !isNew });

  // mutations
  const { mutateAsync: createCategory, mutationResult: createResult } = useCustomMutation(
    async (category: Category) => api.business().createCategory(businessId, categoryId, category),
    'createCategory',
    false
  );
  const { mutateAsync: updateCategory, mutationResult: updateResult } = useCustomMutation(
    async (category: Partial<Category>) =>
      api.business().updateCategory(businessId, categoryId, category),
    'updateCategory',
    false
  );
  const { mutateAsync: deleteCategory, mutationResult: deleteCategoryResult } = useCustomMutation(
    async () => api.business().deleteCategory(businessId, categoryId),
    'deleteCategory',
    false
  );
  const saveCategory = isNew ? createCategory : updateCategory;
  const result = createResult || updateResult;

  // side effects
  React.useEffect(() => {
    if (!id) return;
    if (id === 'new') {
      (async () => {
        const newId = await api.business().createCategoryRef(businessId);
        setCategoryId(newId);
      })();
    } else setCategoryId(id);
  }, [id]);
  // return
  return {
    category: fetchResult.data,
    id: categoryId,
    createCategory,
    updateCategory,
    deleteCategory,
    saveCategory,
    deleteCategoryResult,
    result,
  };
};
