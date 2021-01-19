import { arrayMove } from 'app/utils/arrayMove';
import { Category, MenuConfig, Product, WithId } from 'appjusto-types';
import { Complement, ComplementGroup } from 'appjusto-types/menu';
import { without, omit } from 'lodash';

export const empty = (): MenuConfig => ({ categoriesOrder: [], productsOrderByCategoryId: {} });

//

const ordered = <T extends Object>(items: WithId<T>[], order: string[]): WithId<T>[] => {
  return items
    .filter((i) => order.indexOf(i.id) !== -1) // filtering out first
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

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
    categoriesOrder: without(menuConfig.categoriesOrder, categoryId),
    productsOrderByCategoryId: omit(productsOrderByCategoryId, [categoryId]),
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
      [categoryId]: without(productsOrderByCategoryId[categoryId], productId),
    },
  } as MenuConfig;
};

export const updateProductCategory = (
  menuConfig: MenuConfig,
  productId: string,
  categoryId: string
) => {
  const currentCategoryId = getProductCategoryId(menuConfig, productId);
  // avoid update when category is the same
  if (currentCategoryId === categoryId) return menuConfig;
  let nextMenuConfig: MenuConfig = menuConfig;
  // remove product from its current category
  if (currentCategoryId) {
    nextMenuConfig = removeProductFromCategory(menuConfig, productId, currentCategoryId);
  }
  // add to the new category
  return addProductToCategory(nextMenuConfig, productId, categoryId);
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

// menu
export const getOrderedMenu = <T extends object, T2 extends object>(
  categories: WithId<T>[],
  products: WithId<T2>[],
  config: MenuConfig | undefined
) => {
  console.log(categories, products, config);
  if (categories.length === 0 || !config) return [];
  const { categoriesOrder, productsOrderByCategoryId } = config;
  return ordered(categories, categoriesOrder).map((category) => {
    if (!productsOrderByCategoryId) {
      return {
        ...category,
        products: [],
      };
    }
    return {
      ...category,
      products: ordered(products, productsOrderByCategoryId[category.id]),
    };
  });
};
