import * as menu from 'app/api/business/menu/functions';
import { useObserveProduct } from 'app/api/business/products/useObserveProduct';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import { ComplementGroup, Product, WithId } from 'appjusto-types';
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
  const { productsOrdering, updateProductsOrdering, complementsGroupsWithItems } = useContextMenu();
  const { productId: productIdParam } = useParams<Params>();
  const productId = productIdParam.split('?')[0];
  const { product, isValid, imageUrl } = useObserveProduct(businessId, productId, '1008x720');
  const contextCategoryId = menu.getParentId(productsOrdering, productId);
  const queryCache = useQueryCache();
  const sortedGroups = complementsGroupsWithItems.filter((group) => false); // product config complements array
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
      if (data.categoryId)
        updateProductsOrdering(menu.updateParent(productsOrdering, id, data.categoryId));
      if (data.imageFiles) queryCache.invalidateQueries(['product:image', productId]);
      return id;
    }
  );

  const [deleteProduct, deleteProductResult] = useMutation(async () => {
    if (contextCategoryId) {
      updateProductsOrdering(
        menu.removeSecondLevel(productsOrdering, productId, contextCategoryId)
      );
    }
    await api.business().deleteProduct(businessId!, productId);
  });

  // complements groups
  const [connectComplmentsGroupToProduct, connectionResult] = useMutation(
    async (data: { groupsIds: string[] }) => {
      if (!data.groupsIds) {
        throw new Error(`Argumentos inválidos: groupId: ${data.groupsIds}.`);
      }
      await api
        .business()
        .updateProduct(businessId!, productId, { complementsGroupsIds: data.groupsIds });
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
        sortedGroups,
        updateProduct,
        updateProductResult,
        deleteProduct,
        deleteProductResult,
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
