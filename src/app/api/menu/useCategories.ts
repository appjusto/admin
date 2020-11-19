import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';

export const useCategories = () => {
  const api = useApi()!;
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);
  React.useEffect(() => {
    return api.menu().observeCategories({ restaurantId: 'default' }, setCategories);
  }, [api]);
  return categories;
};
