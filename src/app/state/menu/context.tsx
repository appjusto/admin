import { useObserveCategories } from 'app/api/business/categories/useObserveCategories';
import { useObserveComplements2 } from 'app/api/business/complements/useObserveComplements2';
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
  ordering: Ordering;
  complementsGroupsWithItems: WithId<ComplementGroup>[];
  complements: WithId<Complement>[];
  updateMenuOrdering: (ordering: Ordering) => void;
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
  updateComplement: MutateFunction<
    void,
    unknown,
    {
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
  const { ordering, updateMenuOrdering } = useObserveMenuOrdering(businessId);
  const categories = menu.getSorted(unorderedCategories, products, ordering);
  const { complementsGroupsWithItems, complements } = useObserveComplements2(businessId!);
  // groups
  const [updateComplementsGroup, updateGroupResult] = useMutation(
    async (data: { groupId: string | undefined; changes: ComplementGroup }) => {
      if (data.groupId) {
        await api.business().updateComplementsGroup2(businessId!, data.groupId, data.changes);
      } else {
        await api.business().createComplementsGroup2(businessId!, data.changes);
      }
    }
  );
  const [deleteComplementsGroup, deleteGroupResult] = useMutation(async (groupId: string) => {
    await api.business().deleteComplementsGroup2(businessId!, groupId);
  });
  // complements
  const [updateComplement, updateComplementResult] = useMutation(
    async (data: {
      complementId: string | undefined;
      changes: Complement;
      imageFile?: File | null;
    }) => {
      if (data.complementId) {
        await api
          .business()
          .updateComplement2(businessId!, data.complementId, data.changes, data.imageFile);
      } else {
        await api.business().createComplement2(businessId!, data.changes, data.imageFile);
      }
    }
  );
  const [deleteComplement, deleteComplementResult] = useMutation(
    async (data: { complementId: string; imageExists: boolean }) => {
      await api.business().deleteComplement2(businessId!, data.complementId);
    }
  );
  // provider
  return (
    <MenuProviderContext.Provider
      value={{
        categories,
        ordering,
        complementsGroupsWithItems,
        complements,
        updateMenuOrdering,
        updateComplementsGroup,
        updateGroupResult,
        deleteComplementsGroup,
        deleteGroupResult,
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
