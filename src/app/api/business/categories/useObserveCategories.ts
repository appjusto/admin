import { Category, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../../../state/api/context';

export const useObserveCategories = (isMenuActive: boolean, businessId?: string) => {
  // contex
  const api = useContextApi();
  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!isMenuActive) return;
    if (!businessId) return;
    const unsub = api.business().observeCategories(businessId, setCategories);
    return () => unsub();
  }, [api, isMenuActive, businessId]);
  // return
  return categories;
};
