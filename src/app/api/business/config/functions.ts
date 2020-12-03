import { arrayMove } from 'app/utils/arrayMove';
import { MenuConfig } from 'appjusto-types';

export const empty = (): MenuConfig => ({ categoriesOrder: [], productsOrderByCategoryId: {} });

// categories

export const addCategory = (menuConfig: MenuConfig, categoryId: string) => {
  const { categoriesOrder, productsOrderByCategoryId } = menuConfig;
  if (categoriesOrder.indexOf(categoryId) !== -1) return menuConfig;
  return {
    categoriesOrder: [...categoriesOrder, categoryId],
    productsOrderByCategoryId: {
      ...productsOrderByCategoryId,
      [categoryId]: [],
    },
  } as MenuConfig;
};

export const removeCategory = (menuConfig: MenuConfig, categoryId: string) => {
  const { categoriesOrder, productsOrderByCategoryId } = menuConfig;
  const categoryIndex = categoriesOrder.indexOf(categoryId);
  if (categoryIndex === -1) return menuConfig;
  return {
    categoriesOrder: [
      ...categoriesOrder.slice(0, categoryIndex),
      ...categoriesOrder.slice(categoryIndex + 1),
    ],
    productsOrderByCategoryId: {
      ...productsOrderByCategoryId,
      [categoryId]: [],
    },
  } as MenuConfig;
};

export const updateCategoryIndex = (
  menuConfig: MenuConfig,
  categoryId: string,
  newIndex: number
) => {
  const { categoriesOrder } = menuConfig;
  const previousIndex = categoriesOrder.indexOf(categoryId);
  return {
    ...menuConfig,
    categoriesOrder: arrayMove<string>(categoriesOrder, previousIndex, newIndex),
  } as MenuConfig;
};

// products

export const addProductToCategory = (
  menuConfig: MenuConfig,
  productId: string,
  categoryId: string
) => {
  const { productsOrderByCategoryId } = menuConfig;
  return {
    ...menuConfig,
    productsOrderByCategoryId: {
      ...productsOrderByCategoryId,
      [categoryId]: (productsOrderByCategoryId[categoryId] ?? []).concat(productId),
    },
  } as MenuConfig;
};

export const getProductCategoryId = (menuConfig: MenuConfig, productId: string) => {
  const { categoriesOrder, productsOrderByCategoryId } = menuConfig;
  return categoriesOrder.find(
    (id) => (productsOrderByCategoryId[id] ?? []).indexOf(productId) !== -1
  );
};

export const removeProductFromCategory = (
  menuConfig: MenuConfig,
  productId: string,
  categoryId: string
) => {
  const { productsOrderByCategoryId } = menuConfig;
  return {
    ...menuConfig,
    productsOrderByCategoryId: {
      ...productsOrderByCategoryId,
      [categoryId]: productsOrderByCategoryId[categoryId].filter((id) => id !== productId),
    },
  } as MenuConfig;
};

export const updateProductIndex = (
  menuConfig: MenuConfig,
  productId: string,
  fromCategoryId: string,
  toCategoryId: string,
  from: number,
  to: number
) => {
  const { productsOrderByCategoryId } = menuConfig;
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
  return {
    ...menuConfig,
    productsOrderByCategoryId: newProductsOrderByCategoryId,
  } as MenuConfig;
};
