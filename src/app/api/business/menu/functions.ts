import { arrayMove } from 'app/utils/arrayMove';
import { ComplementGroup, Ordering, WithId } from 'appjusto-types';
import { without, omit } from 'lodash';

export const empty = (): Ordering => ({ firstLevelIds: [], secondLevelIdsByFirstLevelId: {} });

//

const ordered = <T extends object>(items: WithId<T>[], order: string[]): WithId<T>[] => {
  return items
    .filter((i) => order.indexOf(i.id) !== -1) // filtering out first
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

// first level

export const addFirstLevel = (ordering: Ordering, firstLevelId: string) => {
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = ordering;
  if (firstLevelIds.indexOf(firstLevelId) !== -1) return ordering;
  return {
    firstLevelIds: [...firstLevelIds, firstLevelId],
    secondLevelIdsByFirstLevelId: {
      ...secondLevelIdsByFirstLevelId,
      [firstLevelId]: [],
    },
  } as Ordering;
};

export const removeFirstLevel = (ordering: Ordering, firstLevelId: string) => {
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = ordering;
  const index = firstLevelIds.indexOf(firstLevelId);
  if (index === -1) return ordering;
  return {
    firstLevelIds: without(ordering.firstLevelIds, firstLevelId),
    secondLevelIdsByFirstLevelId: omit(secondLevelIdsByFirstLevelId, [firstLevelId]),
  } as Ordering;
};

export const updateFirstLevelIndex = (
  ordering: Ordering,
  firstLevelId: string,
  newIndex: number
) => {
  const { firstLevelIds } = ordering;
  const previousIndex = firstLevelIds.indexOf(firstLevelId);
  return {
    ...ordering,
    firstLevelIds: arrayMove<string>(firstLevelIds, previousIndex, newIndex),
  } as Ordering;
};

// second levels
export const getConnectedProductConfig = (
  productConfig: Ordering,
  groups: WithId<ComplementGroup>[]
) => {
  let newProductConfig = { ...productConfig };
  groups.forEach((group) => {
    if (group.complements) {
      newProductConfig = {
        firstLevelIds: [...newProductConfig.firstLevelIds, group.id],
        secondLevelIdsByFirstLevelId: {
          ...newProductConfig.secondLevelIdsByFirstLevelId,
          [group.id]: (newProductConfig.secondLevelIdsByFirstLevelId[group.id] ?? []).concat(
            group.complements
          ),
        },
      };
    }
  });
  return newProductConfig;
};

export const addSecondLevel = (ordering: Ordering, secondLevelId: string, firstLevelId: string) => {
  const { secondLevelIdsByFirstLevelId } = ordering;
  return {
    ...ordering,
    secondLevelIdsByFirstLevelId: {
      ...secondLevelIdsByFirstLevelId,
      [firstLevelId]: (secondLevelIdsByFirstLevelId[firstLevelId] ?? []).concat(secondLevelId),
    },
  } as Ordering;
};

export const getSecondLevelIds = (ordering: Ordering, firstLevelId: string) =>
  ordering.secondLevelIdsByFirstLevelId[firstLevelId];

export const getParentId = (ordering: Ordering, secondLevelId: string) => {
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = ordering;
  return firstLevelIds.find(
    (id) => (secondLevelIdsByFirstLevelId[id] ?? []).indexOf(secondLevelId) !== -1
  );
};

export const removeSecondLevel = (
  ordering: Ordering,
  secondLevelId: string,
  firstLevelId: string
) => {
  const { secondLevelIdsByFirstLevelId } = ordering;
  return {
    ...ordering,
    secondLevelIdsByFirstLevelId: {
      ...secondLevelIdsByFirstLevelId,
      [firstLevelId]: without(secondLevelIdsByFirstLevelId[firstLevelId], secondLevelId),
    },
  } as Ordering;
};

export const updateParent = (ordering: Ordering, secondLevelId: string, firstLevelId: string) => {
  const currentParentId = getParentId(ordering, secondLevelId);
  // avoid update when parent is the same
  if (currentParentId === firstLevelId) return ordering;
  let nextOrdering: Ordering = ordering;
  // remove from its current parent
  if (currentParentId) {
    nextOrdering = removeSecondLevel(ordering, secondLevelId, currentParentId);
  }
  // add to the new parent
  return addSecondLevel(nextOrdering, secondLevelId, firstLevelId);
};

export const updateSecondLevelIndex = (
  ordering: Ordering,
  secondLevelId: string,
  fromParentId: string,
  toParentId: string,
  from: number,
  to: number
) => {
  const { secondLevelIdsByFirstLevelId } = ordering;
  const fromOrder = secondLevelIdsByFirstLevelId[fromParentId];
  const toOrder = secondLevelIdsByFirstLevelId[toParentId] ?? [];
  let newOrderByParentId = {};
  if (fromParentId === toParentId) {
    // moving inside same parent
    newOrderByParentId = {
      ...secondLevelIdsByFirstLevelId,
      [fromParentId]: arrayMove<string>(toOrder, from, to),
    };
  } else {
    // moving to another parent
    newOrderByParentId = {
      ...secondLevelIdsByFirstLevelId,
      [fromParentId]: fromOrder.filter((id) => id !== secondLevelId),
      [toParentId]: [...toOrder.slice(0, to), secondLevelId, ...toOrder.slice(to)],
    };
  }
  return {
    ...ordering,
    secondLevelIdsByFirstLevelId: newOrderByParentId,
  } as Ordering;
};

// menu
export const getSorted = <T extends object, T2 extends object>(
  firstLevels: WithId<T>[],
  secondLevels: WithId<T2>[],
  config: Ordering | undefined
) => {
  if (firstLevels.length === 0 || !config) return [];
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = config;
  return ordered(firstLevels, firstLevelIds).map((parent) => {
    if (!secondLevelIdsByFirstLevelId) {
      return {
        ...parent,
        items: [],
      };
    }
    return {
      ...parent,
      items: ordered(secondLevels, secondLevelIdsByFirstLevelId[parent.id]),
    };
  });
};
