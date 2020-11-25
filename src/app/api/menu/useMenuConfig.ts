import { useBusinessId } from 'app/state/business/context';
import { arrayMove } from 'app/utils/arrayMove';
import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useApi } from '../context';

export const useMenuConfig = () => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;

  // state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>({
    categoriesOrder: [],
    productsOrderByCategoryId: {},
  });
  const { categoriesOrder, productsOrderByCategoryId } = menuConfig;

  // side effects
  React.useEffect(() => {
    return api.menu().observeMenuConfig(businessId, setMenuConfig);
  }, [api, businessId]);

  // mutations
  const [updateMenuConfig] = useMutation((menuConfig: MenuConfig) => {
    setMenuConfig(menuConfig); // optimistic update
    return api.menu().updateMenuConfig(businessId, menuConfig);
  });

  // return
  const updateCategoryIndex = (categoryId: string, newIndex: number) => {
    const previousIndex = categoriesOrder.indexOf(categoryId);
    updateMenuConfig({
      ...menuConfig,
      categoriesOrder: arrayMove<string>(categoriesOrder, previousIndex, newIndex),
    });
  };

  const updateProductIndex = (
    productId: string,
    fromCategoryId: string,
    toCategoryId: string,
    from: number,
    to: number
  ) => {
    const fromCategoryOrder = productsOrderByCategoryId[fromCategoryId];
    const toCategoryOrder = productsOrderByCategoryId[toCategoryId] ?? [];
    let newProductsOrderByCategoryId = {};
    if (fromCategoryId === toCategoryId) {
      // moving product inside same category
      newProductsOrderByCategoryId = {
        ...productsOrderByCategoryId,
        [fromCategoryId]: arrayMove<string>(toCategoryOrder, from, to),
      };
    } else {
      // moving product to another category
      newProductsOrderByCategoryId = {
        ...productsOrderByCategoryId,
        [fromCategoryId]: fromCategoryOrder.filter((id) => id !== productId),
        [toCategoryId]: [...toCategoryOrder.slice(0, to), productId, ...toCategoryOrder.slice(to)],
      };
    }
    updateMenuConfig({
      ...menuConfig,
      productsOrderByCategoryId: newProductsOrderByCategoryId,
    });
  };

  return { menuConfig, updateCategoryIndex, updateProductIndex };
};
