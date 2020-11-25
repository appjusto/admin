import React from 'react';
import { useCategories } from './categories/useCategories';
import { useMenuConfig } from './useMenuConfig';
import { useProducts } from './products/useProducts';
import { memoize } from 'lodash';

export const useMenu = () => {
  // state
  const unorderedCategories = useCategories();
  const unorderedProducts = useProducts();
  const { menuConfig, updateCategoryIndex, updateProductIndex } = useMenuConfig(); // holds the order of categories and its products
  const { categoriesOrder, productsOrderByCategoryId } = menuConfig;

  // categories
  // sort according with categoriesOrder
  const categories = React.useMemo(() => {
    if (categoriesOrder.length === 0) return []; // prefer returning empty list to avoid reordering after render
    return unorderedCategories.sort((a, b) =>
      categoriesOrder.indexOf(a.id) === -1
        ? 1 // new categories go to the end by the default
        : categoriesOrder.indexOf(a.id) - categoriesOrder.indexOf(b.id)
    );
  }, [categoriesOrder, unorderedCategories]);

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

  return { categories, getProductsByCategoryId, updateCategoryIndex, updateProductIndex };
};
