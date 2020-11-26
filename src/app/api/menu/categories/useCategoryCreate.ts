import { useBusinessId } from 'app/state/business/context';
import { Category } from 'appjusto-types';
import { useMutation } from 'react-query';
import { useApi } from '../../context';

export const useCategoryCreate = () => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;

  // mutations
  const [createCategory, result] = useMutation((category: Category) =>
    api.menu().createCategory(businessId, category)
  );

  // return
  return { createCategory, result };
};
