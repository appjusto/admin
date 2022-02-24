import { Category, Complement, ComplementGroup, Ordering, WithId } from '@appjusto/types';
import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import { useObserveComplements } from 'app/api/business/complements/useObserveComplements';
import * as menu from 'app/api/business/menu/functions';
import { useObserveMenuOrdering } from 'app/api/business/menu/useObserveMenuOrdering';
import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { MutationResult, useCustomMutation } from 'app/api/mutation/useCustomMutation';
import React from 'react';
import { MutateFunction } from 'react-query';
import { useContextApi } from '../api/context';
import { useContextBusinessId } from '../business/context';

interface ContextProps {
  setIsMenuActive: (value: boolean) => void;
  isProductsPage: boolean;
  setIsProductPage(value: boolean): void;
  categories: WithId<Category>[];
  productsOrdering: Ordering;
  updateProductsOrdering: (ordering: Ordering) => void;
  complementsOrdering: Ordering;
  updateComplementsOrdering: (ordering: Ordering) => void;
  complementsGroups: WithId<ComplementGroup>[];
  complementsGroupsWithItems: WithId<ComplementGroup>[];
  complements: WithId<Complement>[];
  sortedComplementsGroups: WithId<ComplementGroup>[];
  getComplementsGroupById: (groupId?: string) => WithId<ComplementGroup> | undefined;
  updateComplementsGroup: MutateFunction<
    void,
    unknown,
    {
      groupId: string | undefined;
      changes: ComplementGroup;
    },
    unknown
  >;
  updateGroupResult: MutationResult;
  deleteComplementsGroup: MutateFunction<void, unknown, string, unknown>;
  deleteGroupResult: MutationResult;
  getComplementData: (
    complementId: string,
    groupId?: string
  ) => {
    group: WithId<ComplementGroup> | undefined;
    complement: WithId<Complement> | undefined;
  };
  updateComplement: MutateFunction<
    void,
    unknown,
    {
      groupId: string | undefined;
      complementId: string | undefined;
      changes: Complement;
      imageFile?: File | null | undefined;
    },
    unknown
  >;
  updateComplementResult: MutationResult;
  deleteComplement: MutateFunction<
    void,
    unknown,
    {
      complementId: string;
      imageExists: boolean;
    },
    unknown
  >;
  deleteComplementResult: MutationResult;
}

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}
const MenuContext = React.createContext<ContextProps>({} as ContextProps);

export const MenuContextProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  // state
  const [isMenuActive, setIsMenuActive] = React.useState(false);
  const [isProductsPage, setIsProductPage] = React.useState(true);
  // hooks
  const unorderedCategories = useObserveCategories(isMenuActive, businessId);
  const products = useObserveProducts(isMenuActive, businessId);
  const {
    productsOrdering,
    updateProductsOrdering,
    complementsOrdering,
    updateComplementsOrdering,
  } = useObserveMenuOrdering(isMenuActive, businessId);
  const { complementsGroups, complements } = useObserveComplements(isMenuActive, businessId);
  // helpers
  const categories = menu.getSorted(unorderedCategories, products, productsOrdering);
  const complementsGroupsWithItems = menu.getSorted(
    complementsGroups,
    complements,
    complementsOrdering
  );
  const sortedComplementsGroups = menu.getSorted(
    complementsGroups,
    complements,
    complementsOrdering
  );
  // complements groups
  const getComplementsGroupById = (groupId?: string) =>
    complementsGroups.find((group) => group.id === groupId);
  const {
    mutateAsync: updateComplementsGroup,
    mutationResult: updateGroupResult,
  } = useCustomMutation(
    async (data: { groupId: string | undefined; changes: ComplementGroup }) => {
      if (data.groupId) {
        await api.business().updateComplementsGroup(businessId!, data.groupId, data.changes);
      } else {
        const newGroup = await api.business().createComplementsGroup(businessId!, data.changes);
        updateComplementsOrdering(menu.addFirstLevel(complementsOrdering, newGroup.id));
      }
    },
    'updateComplementsGroup',
    false
  );
  const {
    mutateAsync: deleteComplementsGroup,
    mutationResult: deleteGroupResult,
  } = useCustomMutation(
    async (groupId: string) => {
      const complementsIds = complementsOrdering.secondLevelIdsByFirstLevelId[groupId];
      complementsIds.forEach(async (id) => {
        await api.business().deleteComplement(businessId!, id);
      });
      updateComplementsOrdering(menu.removeFirstLevel(complementsOrdering, groupId));
      await api.business().deleteComplementsGroup(businessId!, groupId);
    },
    'deleteComplementsGroup',
    false
  );
  // complements
  const getComplementData = (complementId: string, groupId?: string) => {
    const complement = complements.find((complement) => complement.id === complementId);
    const parentId = groupId ?? menu.getParentId(complementsOrdering, complementId);
    const group = complementsGroups.find((group) => group.id === parentId);
    return { group, complement };
  };
  const {
    mutateAsync: updateComplement,
    mutationResult: updateComplementResult,
  } = useCustomMutation(
    async (data: {
      groupId: string | undefined;
      complementId: string | undefined;
      changes: Complement;
      imageFile?: File | null;
    }) => {
      let currentId = data.complementId;
      if (data.complementId && data.complementId !== 'new') {
        await api
          .business()
          .updateComplement(businessId!, data.complementId, data.changes, data.imageFile);
      } else {
        currentId = await api
          .business()
          .createComplement(businessId!, data.changes, data.imageFile);
      }
      if (data.groupId)
        updateComplementsOrdering(menu.updateParent(complementsOrdering, currentId!, data.groupId));
    },
    'updateComplement',
    false
  );
  const {
    mutateAsync: deleteComplement,
    mutationResult: deleteComplementResult,
  } = useCustomMutation(async (data: { complementId: string; imageExists: boolean }) => {
    updateComplementsOrdering(menu.removeSecondLevel(complementsOrdering, data.complementId));
    await api.business().deleteComplement(businessId!, data.complementId);
  }, 'deleteComplement');
  // provider
  return (
    <MenuContext.Provider
      value={{
        setIsMenuActive,
        isProductsPage,
        setIsProductPage,
        categories,
        productsOrdering,
        updateProductsOrdering,
        complementsOrdering,
        updateComplementsOrdering,
        complementsGroups,
        complementsGroupsWithItems,
        complements,
        sortedComplementsGroups,
        getComplementsGroupById,
        updateComplementsGroup,
        updateGroupResult,
        deleteComplementsGroup,
        deleteGroupResult,
        getComplementData,
        updateComplement,
        updateComplementResult,
        deleteComplement,
        deleteComplementResult,
      }}
      {...props}
    />
  );
};

export const useContextMenu = () => {
  return React.useContext(MenuContext)!;
};
