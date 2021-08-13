import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import { useObserveComplements } from 'app/api/business/complements/useObserveComplements';
import * as menu from 'app/api/business/menu/functions';
import { useObserveMenuOrdering } from 'app/api/business/menu/useObserveMenuOrdering';
import { useObserveProducts } from 'app/api/business/products/useObserveProducts';
import { Category, Complement, ComplementGroup, Ordering, WithId } from 'appjusto-types';
import React from 'react';
import { MutateFunction, MutationResult, useMutation } from 'react-query';
import { useContextApi } from '../api/context';
import { useContextBusinessId } from '../business/context';

interface ContextProps {
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
  updateGroupResult: MutationResult<void, unknown>;
  deleteComplementsGroup: MutateFunction<void, unknown, string, unknown>;
  deleteGroupResult: MutationResult<void, unknown>;
  getComplementData: (
    complementId: string
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
  updateComplementResult: MutationResult<void, unknown>;
  deleteComplement: MutateFunction<
    void,
    unknown,
    {
      complementId: string;
      imageExists: boolean;
    },
    unknown
  >;
  deleteComplementResult: MutationResult<void, unknown>;
}

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}
const MenuProviderContext = React.createContext<ContextProps>({} as ContextProps);

export const MenuProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const unorderedCategories = useObserveCategories(businessId);
  const products = useObserveProducts(businessId);
  const {
    productsOrdering,
    updateProductsOrdering,
    complementsOrdering,
    updateComplementsOrdering,
  } = useObserveMenuOrdering(businessId);
  const categories = menu.getSorted(unorderedCategories, products, productsOrdering);
  const { complementsGroups, complements } = useObserveComplements(businessId!);
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

  const [updateComplementsGroup, updateGroupResult] = useMutation(
    async (data: { groupId: string | undefined; changes: ComplementGroup }) => {
      if (data.groupId) {
        await api.business().updateComplementsGroup(businessId!, data.groupId, data.changes);
      } else {
        const newGroup = await api.business().createComplementsGroup(businessId!, data.changes);
        updateComplementsOrdering(menu.addFirstLevel(complementsOrdering, newGroup.id));
      }
    }
  );
  const [deleteComplementsGroup, deleteGroupResult] = useMutation(async (groupId: string) => {
    updateComplementsOrdering(menu.removeFirstLevel(complementsOrdering, groupId));
    await api.business().deleteComplementsGroup(businessId!, groupId);
  });
  // complements
  const getComplementData = (complementId: string) => {
    const complement = complements.find((complement) => complement.id === complementId);
    const parentId = menu.getParentId(complementsOrdering, complementId);
    const group = complementsGroups.find((group) => group.id === parentId);
    return { group, complement };
  };

  const [updateComplement, updateComplementResult] = useMutation(
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
    }
  );
  const [deleteComplement, deleteComplementResult] = useMutation(
    async (data: { complementId: string; imageExists: boolean }) => {
      updateComplementsOrdering(menu.removeSecondLevel(complementsOrdering, data.complementId));
      await api.business().deleteComplement(businessId!, data.complementId);
    }
  );
  // provider
  return (
    <MenuProviderContext.Provider
      value={{
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
  return React.useContext(MenuProviderContext)!;
};
