import { useBusinessValue } from 'app/state/business/context';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../../context';

export const useObserveCategories = () => {
  // contex
  const api = useApi()!;
  const business = useBusinessValue()!;

  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);

  // side effects
  React.useEffect(() => {
    return api.menu().observeCategories(business.id, setCategories);
  }, [api, business.id]);

  // return
  return categories;
};
