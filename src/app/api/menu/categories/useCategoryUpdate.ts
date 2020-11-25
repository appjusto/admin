import { useBusinessId } from 'app/state/business/context';
import { Category } from 'appjusto-types';
import { useMutation } from 'react-query';
import { useApi } from '../../context';

export const useCategoryUpdate = (categoryId: string) => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;

  // mutations
  const [updateCategory, result] = useMutation((changes: Partial<Category>) =>
    api.menu().updateCategory(businessId, categoryId, changes)
  );

  // return
  return { updateCategory, result };
};
