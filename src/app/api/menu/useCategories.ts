import { useBusinessValue } from 'app/state/business/context';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';

export const useCategories = () => {
  const api = useApi()!;
  const business = useBusinessValue()!;
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);
  React.useEffect(() => {
    return api.menu().observeCategories(business.id, setCategories);
  }, [api, business.id]);
  return categories;
};
