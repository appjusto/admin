import { useObserveCategories } from 'app/api/menu/categories/useObserveCategories';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useMenuConfigValue } from './config';

const CategoriesContext = React.createContext<WithId<Category>[]>([]);

export const CategoriesProvider = (
  props: Omit<React.ProviderProps<WithId<Category>[]>, 'value'>
) => {
  // context

  const unorderedCategories = useObserveCategories();
  const { menuConfig } = useMenuConfigValue();
  const { categoriesOrder } = menuConfig;

  const categories = React.useMemo(() => {
    return unorderedCategories.sort((a, b) =>
      categoriesOrder.indexOf(a.id) === -1
        ? 1 // new categories go to the end by the default
        : categoriesOrder.indexOf(a.id) - categoriesOrder.indexOf(b.id)
    );
  }, [categoriesOrder, unorderedCategories]);

  return (
    <CategoriesContext.Provider value={categories}>{props.children}</CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  return React.useContext(CategoriesContext)!;
};
