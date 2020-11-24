import { arrayMove } from 'app/utils/arrayMove';
import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { useApi } from '../context';
import { useCategories } from './useCategories';
import { useMenuConfig } from './useMenuConfig';
import { useProducts } from './useProducts';
import { memoize } from 'lodash';

export const useMenu = () => {
  // context
  const api = useApi()!;

  // state
  const { menuConfig, setMenuConfig } = useMenuConfig(); // holds the order of categories and its products
  const unorderedCategories = useCategories();
  const unorderedProducts = useProducts();
  const { categoriesOrder, productsOrderByCategoryId } = menuConfig ?? {};

  // categories
  // sort according with categoriesOrder
  const categories = React.useMemo(() => {
    if (categoriesOrder.length === 0) return []; // prefer returning empty list to avoid reordering after render
    return unorderedCategories.sort((a, b) =>
      categoriesOrder.indexOf(a.id) === -1
        ? 1 //
        : categoriesOrder.indexOf(a.id) - categoriesOrder.indexOf(b.id)
    );
  }, [categoriesOrder, unorderedCategories]);

  // update category order
  const updateCategoryIndex = (categoryId: string, newIndex: number) => {
    const previousIndex = categoriesOrder.indexOf(categoryId);
    const newMenuConfig: MenuConfig = {
      ...menuConfig,
      categoriesOrder: arrayMove<string>(categoriesOrder, previousIndex, newIndex),
    };
    setMenuConfig(newMenuConfig); // optimistic update
    api.menu().updateMenuConfig('default', newMenuConfig);
  };

  // products
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProductsByCategoryId = React.useCallback(
    memoize((categoryId: string) => {
      const productsOrder = productsOrderByCategoryId[categoryId];
      if (!productsOrder) return [];
      return unorderedProducts
        .filter((product) => productsOrder.indexOf(product.id) !== -1) // only in this category
        .sort((a, b) => productsOrder.indexOf(a.id) - productsOrder.indexOf(b.id));
    }),
    [unorderedProducts, productsOrderByCategoryId]
  );

  // update product order
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
    const newMenuConfig: MenuConfig = {
      ...menuConfig,
      productsOrderByCategoryId: newProductsOrderByCategoryId,
    };
    setMenuConfig(newMenuConfig); // optimistic update
    api.menu().updateMenuConfig('default', newMenuConfig);
  };

  return { categories, getProductsByCategoryId, updateCategoryIndex, updateProductIndex };
};
