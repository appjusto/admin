import { useApi } from 'app/api/context';
import * as functions from 'app/api/menu/config/functions';
import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useBusinessId } from '../business/context';

interface MenuConfigContextValue {
  menuConfig: MenuConfig;
  updateProductCategory: (productId: string, categoryId: string) => void;
  updateCategoryIndex: (categoryId: string, newIndex: number) => void;
  updateProductIndex: (
    productId: string,
    fromCategoryId: string,
    toCategoryId: string,
    from: number,
    to: number
  ) => void;
}

const MenuConfigContext = React.createContext<MenuConfigContextValue | undefined>(undefined);

export const MenuConfigProvider = (
  props: Omit<React.ProviderProps<MenuConfigContextValue>, 'value'>
) => {
  // context
  const api = useApi();
  const businessId = useBusinessId();

  //state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>(functions.empty());
  const [updateMenuConfig] = useMutation(async (menuConfig: MenuConfig) => {
    setMenuConfig(menuConfig); // optimistic update
    api.menu().updateMenuConfig(businessId, menuConfig);
  });

  // side effects
  React.useEffect(() => {
    return api.menu().observeMenuConfig(businessId, setMenuConfig);
  }, [api, businessId]);

  // return
  const updateProductCategory = async (productId: string, categoryId: string) => {
    const currentCategoryId = functions.getProductCategoryId(menuConfig, productId);
    // avoid update when category is the same
    if (currentCategoryId === categoryId) return;
    let nextMenuConfig: MenuConfig = menuConfig;
    // remove product from its current category
    if (currentCategoryId) {
      nextMenuConfig = functions.removeProductFromCategory(
        menuConfig,
        productId,
        currentCategoryId
      );
    }
    // add to the new category
    nextMenuConfig = functions.addProductToCategory(menuConfig, productId, categoryId);
    updateMenuConfig(nextMenuConfig);
  };

  const updateCategoryIndex = (categoryId: string, newIndex: number) =>
    updateMenuConfig(functions.updateCategoryIndex(menuConfig, categoryId, newIndex));

  const updateProductIndex = (
    productId: string,
    fromCategoryId: string,
    toCategoryId: string,
    from: number,
    to: number
  ) =>
    updateMenuConfig(
      functions.updateProductIndex(menuConfig, productId, fromCategoryId, toCategoryId, from, to)
    );

  const value = {
    menuConfig,
    updateProductCategory,
    updateCategoryIndex,
    updateProductIndex,
  } as MenuConfigContextValue;

  return <MenuConfigContext.Provider value={value}>{props.children}</MenuConfigContext.Provider>;
};

export const useMenuConfigValue = () => {
  return React.useContext(MenuConfigContext)!;
};
