import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import * as menu from 'app/api/business/menu/functions';
import { useObserveMenuOrdering } from 'app/api/business/menu/useObserveMenuOrdering';
import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { Category, Ordering, WithId } from 'appjusto-types';
import React from 'react';

interface MenuContextValue {
  categories: WithId<Category>[];
  ordering: Ordering;
  updateMenuOrdering: (ordering: Ordering) => void;
}

interface Props {
  businessId: string | undefined;
  children: React.ReactNode | React.ReactNode[];
}

const MenuProviderContext = React.createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = ({ businessId, children }: Props) => {
  const unorderedCategories = useObserveCategories(businessId);
  const products = useObserveProducts(businessId);
  const { ordering, updateMenuOrdering } = useObserveMenuOrdering(businessId);
  const categories = menu.getOrderedMenu(unorderedCategories, products, ordering);
  const value: MenuContextValue = { categories, ordering, updateMenuOrdering };
  return <MenuProviderContext.Provider value={value}>{children}</MenuProviderContext.Provider>;
};

export const useContextMenu = () => {
  return React.useContext(MenuProviderContext)!;
};
