import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveCategories = (businessId: string | undefined) => {
  // contex
  const api = useContextApi();

  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api.business().observeCategories(businessId, setCategories);
    return () => unsub();
  }, [api, businessId]);

  // return
  return categories;
};
