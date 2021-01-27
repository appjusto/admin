import { useObserveComplements } from 'app/api/business/complements/useObserveComplements';
import * as menu from 'app/api/business/menu/functions';
import { useProduct } from 'app/api/business/products/useProduct2';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import { Complement, ComplementGroup, MenuConfig, Product, WithId } from 'appjusto-types';
import React from 'react';
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
  productConfig: MenuConfig;
  sortedGroups: WithId<ComplementGroup>[];
  onSaveProduct(
    productData: Partial<Product>,
    imageFile: File | null,
    categoryId: string | undefined
  ): Promise<string>;
  onDeleteProduct(imageExists: boolean): void;
  onSaveComplementsGroup(group: ComplementGroup): void;
  onUpdateComplementsGroup(groupId: string, changes: Partial<ComplementGroup>): void;
  onDeleteComplementsGroup(group: WithId<ComplementGroup>): void;
  onSaveComplement(
    groupId: string,
    complementId: string,
    newItem: Complement,
    imageFile: File | null
  ): Promise<void | boolean>;
  onDeleteComplement(complementId: string, groupId: string, hasImage: boolean): void;
  getComplementImageUrl(complementId: string): Promise<string | null>;
}

const ProductContext = React.createContext<ContextProps>({} as ContextProps);

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const ProductContextProvider = (props: ProviderProps) => {
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const { menuConfig, updateMenuConfig } = useContextMenu();
  const { productId } = useParams<Params>();
  const { product, isValid, imageUrl } = useProduct(businessId, productId);
  const { groups, complements } = useObserveComplements(
    businessId!,
    productId,
    product?.complementsEnabled === true
  );
  const sortedGroups = menu.getOrderedMenu(groups, complements, product?.complementsOrder);
  const contextCategoryId = menu.getProductCategoryId(menuConfig, productId);
  const productConfig = product?.complementsOrder ?? menu.empty();

  const onSaveProduct = (
    productData: Partial<Product>,
    imageFile: File | null,
    categoryId: string | undefined
  ) => {
    const id = (async () => {
      const newProduct = {
        ...productData,
      };
      if (productId === 'new') {
        const id = await api
          .business()
          .createProduct(businessId!, newProduct as Product, imageFile);
        updateMenuConfig(menu.updateProductCategory(menuConfig, id, categoryId!));
        return id;
      } else {
        await api.business().updateProduct(businessId!, productId, newProduct, imageFile);
        if (categoryId) {
          updateMenuConfig(menu.updateProductCategory(menuConfig, productId, categoryId!));
        }
        return productId;
      }
    })();
    return id;
  };

  const onDeleteProduct = (imageExists: boolean) => {
    (async () => {
      if (contextCategoryId) {
        updateMenuConfig(menu.removeProductFromCategory(menuConfig, productId, contextCategoryId));
        await api.business().deleteProduct(businessId!, productId, imageExists);
      }
    })();
  };

  const onSaveComplementsGroup = async (group: ComplementGroup) => {
    (async () => {
      const { id: groupId } = await api
        .business()
        .createComplementsGroup(businessId!, productId, group);
      const newProductConfig = menu.addCategory(productConfig, groupId);
      await api.business().updateProduct(
        businessId!,
        productId,
        {
          complementsOrder: newProductConfig,
        },
        null
      );
    })();
  };

  const onUpdateComplementsGroup = async (groupId: string, changes: Partial<ComplementGroup>) => {
    await api.business().updateComplementsGroup(businessId!, productId, groupId, changes);
  };

  const onDeleteComplementsGroup = async (group: WithId<ComplementGroup>) => {
    if (group.items && group.items?.length > 0) {
      group.items.map((item) =>
        api.business().deleteComplement(businessId!, productId, item.id, item.imageExists ?? false)
      );
    }
    const newProductConfig = menu.removeCategory(productConfig, group.id);
    await api.business().updateProduct(
      businessId!,
      productId,
      {
        complementsOrder: newProductConfig,
      },
      null
    );
    await api.business().deleteComplementsGroup(businessId!, productId, group.id);
  };

  const onSaveComplement = async (
    groupId: string | undefined,
    complementId: string | undefined,
    newItem: Complement,
    imageFile: File | null
  ) => {
    if (!complementId) {
      const newId = await api
        .business()
        .createComplement(businessId!, productId, newItem, imageFile);
      let newProductConfig = menu.empty();
      if (productConfig && groupId) {
        newProductConfig = menu.addProductToCategory(productConfig, newId, groupId);
      }
      return api.business().updateProduct(
        businessId!,
        productId,
        {
          complementsOrder: newProductConfig,
        },
        null
      );
    } else {
      return api
        .business()
        .updateComplement(businessId!, productId, complementId, newItem, imageFile);
    }
  };

  const onDeleteComplement = async (
    complementId: string,
    groupId: string,
    imageExists: boolean
  ) => {
    const newProductConfig = menu.removeProductFromCategory(productConfig, complementId, groupId);
    await api.business().updateProduct(
      businessId!,
      productId,
      {
        complementsOrder: newProductConfig,
      },
      null
    );
    await api.business().deleteComplement(businessId!, productId, complementId, imageExists);
  };

  const getComplementImageUrl = React.useCallback(
    async (complementId: string) => {
      const url = await api.business().getComplementImageURL(businessId!, complementId);
      return url;
    },
    [api, businessId]
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
        onSaveProduct,
        onDeleteProduct,
        onSaveComplementsGroup,
        onUpdateComplementsGroup,
        onDeleteComplementsGroup,
        onSaveComplement,
        onDeleteComplement,
        getComplementImageUrl,
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
