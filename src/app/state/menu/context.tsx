import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import * as menu from 'app/api/business/menu/functions';
import { useObserveMenuConfig } from 'app/api/business/menu/useObserveMenuConfig';
import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { CategoryWithProducts, MenuConfig } from 'appjusto-types';
import React from 'react';

interface MenuContextValue {
  categories: CategoryWithProducts[];
  menuConfig: MenuConfig;
  updateMenuConfig: (menuConfig: MenuConfig) => void;
}

interface Props {
  businessId: string | undefined;
  children: React.ReactNode | React.ReactNode[];
}

const MenuProviderContext = React.createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = ({ businessId, children }: Props) => {
  const unorderedCategories = useObserveCategories(businessId);
  const products = useObserveProducts(businessId);
  const { menuConfig, updateMenuConfig } = useObserveMenuConfig(businessId);
  const categories = menu.getOrderedMenu(unorderedCategories, products, menuConfig);
  const value: MenuContextValue = { categories, menuConfig, updateMenuConfig };
  return <MenuProviderContext.Provider value={value}>{children}</MenuProviderContext.Provider>;
};

export const useContextMenu = () => {
  return React.useContext(MenuProviderContext)!;
};
