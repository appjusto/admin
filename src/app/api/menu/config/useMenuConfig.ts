import { useBusinessId } from 'app/state/business/context';
import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useApi } from '../../context';
import * as functions from './functions';

export const useMenuConfig = () => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;

  // state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>({
    categoriesOrder: [],
    productsOrderByCategoryId: {},
  });
  const [updateMenuConfig] = useMutation(async (menuConfig: MenuConfig) => {
    setMenuConfig(menuConfig); // optimistic update
    api.menu().updateMenuConfig(businessId, menuConfig);
  });

  // side effects
  React.useEffect(() => {
    return api.menu().observeMenuConfig(businessId, setMenuConfig);
  }, [api, businessId]);

  // return
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

  // return
  return {
    menuConfig,
    updateCategoryIndex,
    updateProductIndex,
  };
};
