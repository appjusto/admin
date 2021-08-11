import * as menu from 'app/api/business/menu/functions';
import { useObserveProduct } from 'app/api/business/products/useObserveProduct';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import { Complement, ComplementGroup, Ordering, Product, WithId } from 'appjusto-types';
import React from 'react';
import { MutateFunction, MutationResult, useMutation, useQueryCache } from 'react-query';
import { useParams } from 'react-router-dom';

interface Params {
  productId: string;
}

interface ContextProps {
  contextCategoryId: string | undefined;
  productId: string;
  product: WithId<Product> | undefined;
  isValid: boolean;
  imageUrl: string | null;
  productConfig: Ordering;
  sortedGroups: WithId<ComplementGroup>[];
  updateProduct: MutateFunction<
    string,
    unknown,
    {
      changes: Partial<Product>;
      categoryId?: string;
      imageFiles?: File[] | null | undefined;
    },
    unknown
  >;
  updateProductResult: MutationResult<string, unknown>;
  deleteProduct: MutateFunction<void, unknown, undefined, unknown>;
  deleteProductResult: MutationResult<void, unknown>;
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
      groupId: string;
      imageExists: boolean;
    },
    unknown
  >;
  deleteComplementResult: MutationResult<void, unknown>;
  getComplementImageUrl(complementId: string): Promise<string | null>;
  connectComplmentsGroupToProduct: MutateFunction<
    void,
    unknown,
    {
      groupsIds: string[];
    },
    unknown
  >;
  connectionResult: MutationResult<void, unknown>;
}

const ProductContext = React.createContext<ContextProps>({} as ContextProps);

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const ProductContextProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const {
    ordering,
    updateMenuOrdering,
    complementsGroupsWithItems,
    //complements,
  } = useContextMenu();
  const { productId: productIdParam } = useParams<Params>();
  const productId = productIdParam.split('?')[0];
  const { product, isValid, imageUrl } = useObserveProduct(businessId, productId, '1008x720');
  /*const sortedGroups = menu.getSorted(
    complementsGroupsWithItems,
    complements,
    product?.complementsOrder
  );*/
  const sortedGroups = complementsGroupsWithItems.filter((group) => {
    if (product?.complementsOrder) {
      return product?.complementsOrder.firstLevelIds.includes(group.id);
    } else return false;
  });
  const contextCategoryId = menu.getParentId(ordering, productId);
  const productConfig = product?.complementsOrder ?? menu.empty();
  const queryCache = useQueryCache();
  // mutations
  const [updateProduct, updateProductResult] = useMutation(
    async (data: {
      changes: Partial<Product>;
      categoryId?: string;
      imageFiles?: File[] | null;
    }) => {
      const newProduct = {
        ...data.changes,
      } as Product;
      let id = productId;
      if (productId === 'new') {
        id = await api.business().createProduct(businessId!, newProduct, data.imageFiles);
      } else {
        await api.business().updateProduct(businessId!, productId, newProduct, data.imageFiles);
      }
      if (data.categoryId) {
        updateMenuOrdering(menu.updateParent(ordering, id, data.categoryId));
      }
      queryCache.invalidateQueries(['product:image', productId]);
      return id;
    }
  );

  const [deleteProduct, deleteProductResult] = useMutation(async () => {
    if (contextCategoryId) {
      updateMenuOrdering(menu.removeSecondLevel(ordering, productId, contextCategoryId));
    }
    await api.business().deleteProduct(businessId!, productId);
  });

  // groups
  const [updateComplementsGroup, updateGroupResult] = useMutation(
    async (data: { groupId: string | undefined; changes: ComplementGroup }) => {
      if (data.groupId) {
        await api.business().updateComplementsGroup2(businessId!, data.groupId, data.changes);
      } else {
        const group = await api.business().createComplementsGroup2(businessId!, data.changes);
        const newProductConfig = menu.addFirstLevel(productConfig, group.id);
        await api
          .business()
          .updateProduct(businessId!, productId, { complementsOrder: newProductConfig });
      }
    }
  );
  const [deleteComplementsGroup, deleteGroupResult] = useMutation(async (groupId: string) => {
    const newProductConfig = menu.removeFirstLevel(productConfig, groupId);
    await api
      .business()
      .updateProduct(businessId!, productId, { complementsOrder: newProductConfig });
    await api.business().deleteComplementsGroup2(businessId!, groupId);
  });
  // complements
  const [updateComplement, updateComplementResult] = useMutation(
    async (data: {
      groupId: string | undefined;
      complementId: string | undefined;
      changes: Complement;
      imageFile?: File | null;
    }) => {
      if (data.complementId) {
        await api
          .business()
          .updateComplement2(businessId!, data.complementId, data.changes, data.imageFile);
      } else {
        const complementId = await api
          .business()
          .createComplement2(businessId!, data.changes, data.imageFile);
        const currentGroup = complementsGroupsWithItems.find((group) => group.id === data.groupId);
        console.log(currentGroup);
        console.log(data.complementId);
        if (currentGroup) {
          const complements = currentGroup.complements
            ? [...currentGroup.complements, complementId]
            : [complementId];
          await api.business().updateComplementsGroup2(businessId!, data.groupId!, { complements });
        }
        let newProductConfig = menu.empty();
        if (productConfig && data.groupId) {
          newProductConfig = menu.addSecondLevel(productConfig, complementId, data.groupId);
        }
        await api
          .business()
          .updateProduct(businessId!, productId, { complementsOrder: newProductConfig });
      }
    }
  );
  const [deleteComplement, deleteComplementResult] = useMutation(
    async (data: { complementId: string; groupId: string; imageExists: boolean }) => {
      const newProductConfig = menu.removeSecondLevel(
        productConfig,
        data.complementId,
        data.groupId
      );
      await api
        .business()
        .updateProduct(businessId!, productId, { complementsOrder: newProductConfig });
      await api.business().deleteComplement2(businessId!, data.complementId);
    }
  );

  const getComplementImageUrl = React.useCallback(
    async (complementId: string) => {
      const url = await api.business().getComplementImageURL(businessId!, complementId);
      return url;
    },
    [api, businessId]
  );

  const [connectComplmentsGroupToProduct, connectionResult] = useMutation(
    async (data: { groupsIds: string[] }) => {
      const currentGroups = complementsGroupsWithItems.filter((group) =>
        data.groupsIds.includes(group.id)
      );
      if (!data.groupsIds || currentGroups.length === 0) {
        throw new Error(`Argumentos inválidos: groupId: ${data.groupsIds}; groupsIds: empty.`);
      }
      const connectedProductConfig = menu.getConnectedProductConfig(currentGroups);
      await api
        .business()
        .updateProduct(businessId!, productId, { complementsOrder: connectedProductConfig });
    }
  );

  return (
    <ProductContext.Provider
      value={{
        contextCategoryId,
        productId,
        product,
        isValid,
        imageUrl,
        productConfig,
        sortedGroups,
        updateProduct,
        updateProductResult,
        deleteProduct,
        deleteProductResult,
        updateComplementsGroup,
        updateGroupResult,
        deleteComplementsGroup,
        deleteGroupResult,
        updateComplement,
        updateComplementResult,
        deleteComplement,
        deleteComplementResult,
        getComplementImageUrl,
        connectComplmentsGroupToProduct,
        connectionResult,
      }}
      {...props}
    />
  );
};

export const useProductContext = () => {
  const context = React.useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within the ProductContextProvider');
  }
  return context;
};
