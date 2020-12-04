import { useBusinessId } from 'app/state/business/context';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../../../state/api/context';

export const useObserveCategories = () => {
  // contex
  const api = useApi()!;
  const businessId = useBusinessId();

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
