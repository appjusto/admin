import { arrayMove } from 'app/utils/arrayMove';
import { Category, CategoryWithProducts, MenuConfig, Product, ProductsByCategory, WithId } from 'appjusto-types';

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

export const getOrderedCategories = (
  categories: WithId<Category>[],
  order: string[]
): WithId<Category>[] => {
  return categories.sort((a, b) =>
    order.indexOf(a.id) === -1
      ? 1 // new categories go to the end by the default
      : order.indexOf(a.id) - order.indexOf(b.id)
  );
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

export const updateProductCategory = (menuConfig: MenuConfig, productId: string, categoryId: string) => {
  const currentCategoryId = getProductCategoryId(menuConfig, productId);
  // avoid update when category is the same
  if (currentCategoryId === categoryId) return menuConfig;
  let nextMenuConfig: MenuConfig = menuConfig;
  // remove product from its current category
  if (currentCategoryId) {
    nextMenuConfig = removeProductFromCategory(
      menuConfig,
      productId,
      currentCategoryId
    );
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

export const getProductsByCategoryId = (
  products: WithId<Product>[],
  categoryId: string,
  productsOrderByCategoryId: ProductsByCategory
) => {
  const productsOrder = productsOrderByCategoryId[categoryId];
  if (!productsOrder) return [];
  return products
    .filter((product) => productsOrder.indexOf(product.id) !== -1) // only in this category
    .sort((a, b) => productsOrder.indexOf(a.id) - productsOrder.indexOf(b.id));
};

// menu
export const getOrderedMenu = (
  categories: WithId<Category>[],
  products: WithId<Product>[],
  config: MenuConfig
) => {
  if (categories.length === 0) return [];
  const { categoriesOrder, productsOrderByCategoryId } = config;
  return getOrderedCategories(categories, categoriesOrder).map((category) => {
    return {
      ...category,
      products: getProductsByCategoryId(products, category.id, productsOrderByCategoryId),
    } as CategoryWithProducts;
  });
};
