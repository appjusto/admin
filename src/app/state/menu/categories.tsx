import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import { getOrderedCategories } from 'app/api/business/menu/functions';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useContextBusinessId } from '../business/context';
import { useContextMenuConfig } from './config';

const CategoriesContext = React.createContext<WithId<Category>[]>([]);

export const CategoriesProvider = (
  props: Omit<React.ProviderProps<WithId<Category>[]>, 'value'>
) => {
  // context
  const businessId = useContextBusinessId();
  const { menuConfig } = useContextMenuConfig();
  const { categoriesOrder } = menuConfig;
  const unorderedCategories = useObserveCategories(businessId);
  const categories = getOrderedCategories(unorderedCategories, categoriesOrder);

  return (
    <CategoriesContext.Provider value={categories}>{props.children}</CategoriesContext.Provider>
  );
};

export const useContextCategories = () => {
  return React.useContext(CategoriesContext);
};
