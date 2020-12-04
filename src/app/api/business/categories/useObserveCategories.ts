import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../../../state/api/context';

export const useObserveCategories = (businessId: string | undefined) => {
  // contex
  const api = useApi();

  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeCategories(businessId, setCategories);
  }, [api, businessId]);

  // return
  return categories;
};
