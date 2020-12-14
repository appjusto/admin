import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import { getOrderedCategories } from 'app/api/business/menu/functions';
import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useContextBusinessId } from '../business/context';
import { useContextMenuConfig } from './config';

const CategoriesContext = React.createContext<WithId<Category>[]>([]);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const CategoriesProvider = ({ children }: Props) => {
  // context
  const businessId = useContextBusinessId();
  const { menuConfig } = useContextMenuConfig();
  const { categoriesOrder } = menuConfig;
  const unorderedCategories = useObserveCategories(businessId);
  const categories = getOrderedCategories(unorderedCategories, categoriesOrder);

  return <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>;
};

export const useContextCategories = () => {
  return React.useContext(CategoriesContext);
};
