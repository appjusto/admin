import { arrayMove } from 'app/utils/arrayMove';
import { Ordering, WithId } from 'appjusto-types';
import { without, omit } from 'lodash';

export const empty = (): Ordering => ({ firstLevelIds: [], secondLevelIdsByFirstLevelId: {} });

//

const ordered = <T extends Object>(items: WithId<T>[], order: string[]): WithId<T>[] => {
  return items
    .filter((i) => order.indexOf(i.id) !== -1) // filtering out first
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

// categories

export const addCategory = (ordering: Ordering, categoryId: string) => {
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = ordering;
  if (firstLevelIds.indexOf(categoryId) !== -1) return ordering;
  return {
    firstLevelIds: [...firstLevelIds, categoryId],
    secondLevelIdsByFirstLevelId: {
      ...secondLevelIdsByFirstLevelId,
      [categoryId]: [],
    },
  } as Ordering;
};

export const removeCategory = (ordering: Ordering, categoryId: string) => {
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = ordering;
  const categoryIndex = firstLevelIds.indexOf(categoryId);
  if (categoryIndex === -1) return ordering;
  return {
    firstLevelIds: without(ordering.firstLevelIds, categoryId),
    secondLevelIdsByFirstLevelId: omit(secondLevelIdsByFirstLevelId, [categoryId]),
  } as Ordering;
};

export const updateCategoryIndex = (ordering: Ordering, categoryId: string, newIndex: number) => {
  const { firstLevelIds } = ordering;
  const previousIndex = firstLevelIds.indexOf(categoryId);
  return {
    ...ordering,
    firstLevelIds: arrayMove<string>(firstLevelIds, previousIndex, newIndex),
  } as Ordering;
};

// products

export const addProductToCategory = (ordering: Ordering, productId: string, categoryId: string) => {
  const { secondLevelIdsByFirstLevelId } = ordering;
  return {
    ...ordering,
    secondLevelIdsByFirstLevelId: {
      ...secondLevelIdsByFirstLevelId,
      [categoryId]: (secondLevelIdsByFirstLevelId[categoryId] ?? []).concat(productId),
    },
  } as Ordering;
};

export const getProducts = (ordering: Ordering, categoryId: string) =>
  ordering.secondLevelIdsByFirstLevelId[categoryId];

export const getProductCategoryId = (ordering: Ordering, productId: string) => {
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = ordering;
  return firstLevelIds.find(
    (id) => (secondLevelIdsByFirstLevelId[id] ?? []).indexOf(productId) !== -1
  );
};

export const removeProductFromCategory = (
  ordering: Ordering,
  productId: string,
  categoryId: string
) => {
  const { secondLevelIdsByFirstLevelId } = ordering;
  return {
    ...ordering,
    secondLevelIdsByFirstLevelId: {
      ...secondLevelIdsByFirstLevelId,
      [categoryId]: without(secondLevelIdsByFirstLevelId[categoryId], productId),
    },
  } as Ordering;
};

export const updateProductCategory = (
  ordering: Ordering,
  productId: string,
  categoryId: string
) => {
  const currentCategoryId = getProductCategoryId(ordering, productId);
  // avoid update when category is the same
  if (currentCategoryId === categoryId) return ordering;
  let nextOrdering: Ordering = ordering;
  // remove product from its current category
  if (currentCategoryId) {
    nextOrdering = removeProductFromCategory(ordering, productId, currentCategoryId);
  }
  // add to the new category
  return addProductToCategory(nextOrdering, productId, categoryId);
};

export const updateProductIndex = (
  ordering: Ordering,
  productId: string,
  fromCategoryId: string,
  toCategoryId: string,
  from: number,
  to: number
) => {
  const { secondLevelIdsByFirstLevelId } = ordering;
  const fromCategoryOrder = secondLevelIdsByFirstLevelId[fromCategoryId];
  const toCategoryOrder = secondLevelIdsByFirstLevelId[toCategoryId] ?? [];
  let newProductsOrderByCategoryId = {};
  if (fromCategoryId === toCategoryId) {
    // moving product inside same category
    newProductsOrderByCategoryId = {
      ...secondLevelIdsByFirstLevelId,
      [fromCategoryId]: arrayMove<string>(toCategoryOrder, from, to),
    };
  } else {
    // moving product to another category
    newProductsOrderByCategoryId = {
      ...secondLevelIdsByFirstLevelId,
      [fromCategoryId]: fromCategoryOrder.filter((id) => id !== productId),
      [toCategoryId]: [...toCategoryOrder.slice(0, to), productId, ...toCategoryOrder.slice(to)],
    };
  }
  return {
    ...ordering,
    secondLevelIdsByFirstLevelId: newProductsOrderByCategoryId,
  } as Ordering;
};

// menu
export const getOrderedMenu = <T extends object, T2 extends object>(
  categories: WithId<T>[],
  products: WithId<T2>[],
  config: Ordering | undefined
) => {
  if (categories.length === 0 || !config) return [];
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = config;
  return ordered(categories, firstLevelIds).map((category) => {
    if (!secondLevelIdsByFirstLevelId) {
      return {
        ...category,
        items: [],
      };
    }
    return {
      ...category,
      items: ordered(products, secondLevelIdsByFirstLevelId[category.id]),
    };
  });
};
