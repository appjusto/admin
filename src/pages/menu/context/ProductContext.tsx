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
  productId: string;
  product: WithId<Product> | undefined;
  productConfig: MenuConfig;
  sortedGroups: WithId<ComplementGroup>[];
  onSaveProduct(productData: Partial<Product>, imageFile: File | null): void;
  onDeleteProduct(hasImage: boolean): void;
  onSaveComplementsGroup(group: ComplementGroup): void;
  onUpdateComplementsGroup(groupId: string, changes: Partial<ComplementGroup>): void;
  onDeleteComplementsGroup(groupId: string): void;
  onSaveComplement(groupId: string, complementId: string, newItem: Complement): void;
  onDeleteComplement(complementId: string, groupId: string): void;
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
  const product = useProduct(businessId, productId);
  const { groups, complements } = useObserveComplements(
    businessId!,
    product?.complementsEnabled === true
  );
  const sortedGroups = menu.getOrderedMenu(groups, complements, product?.complementsOrder);
  const categoryId = menu.getProductCategoryId(menuConfig, productId);
  const productConfig = product?.complementsOrder ?? menu.empty();

  const onSaveProduct = (productData: Partial<Product>, imageFile: File | null) => {
    (async () => {
      const newProduct = {
        ...productData,
      };
      if (productId === 'new') {
        const id = await api
          .business()
          .createProduct(businessId!, newProduct as Product, imageFile);
        updateMenuConfig(menu.updateProductCategory(menuConfig, id, productData.categoryId!));
        return true;
      } else {
        await api.business().updateProduct(businessId!, productId, newProduct, imageFile);
        updateMenuConfig(
          menu.updateProductCategory(menuConfig, productId, productData.categoryId!)
        );
        return true;
      }
    })();
  };

  const onDeleteProduct = (hasImage: boolean) => {
    (async () => {
      if (categoryId) {
        updateMenuConfig(menu.removeProductFromCategory(menuConfig, productId, categoryId));
        await api.business().deleteProduct(businessId!, productId, hasImage);
      }
    })();
  };

  const onSaveComplementsGroup = async (group: ComplementGroup) => {
    (async () => {
      const { id: groupId } = await api.business().createComplementsGroup(businessId!, group);
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
    await api.business().updateComplementsGroup(businessId!, groupId, changes);
  };

  const onDeleteComplementsGroup = async (groupId: string) => {
    const newProductConfig = menu.removeCategory(productConfig, groupId);
    await api.business().updateProduct(
      businessId!,
      productId,
      {
        complementsOrder: newProductConfig,
      },
      null
    );
    await api.business().deleteComplementsGroup(businessId!, groupId);
  };

  const onSaveComplement = async (
    groupId: string | undefined,
    complementId: string | undefined,
    newItem: Complement
  ) => {
    if (!complementId) {
      const { id } = await api.business().createComplement(businessId!, newItem);
      let newProductConfig = menu.empty();
      if (productConfig && groupId) {
        newProductConfig = menu.addProductToCategory(productConfig, id, groupId);
      }
      await api.business().updateProduct(
        businessId!,
        productId,
        {
          complementsOrder: newProductConfig,
        },
        null
      );
    } else {
      await api.business().updateComplement(businessId!, complementId, newItem);
    }
  };

  const onDeleteComplement = async (complementId: string, groupId: string) => {
    const newProductConfig = menu.removeProductFromCategory(productConfig, complementId, groupId);
    await api.business().updateProduct(
      businessId!,
      productId,
      {
        complementsOrder: newProductConfig,
      },
      null
    );
    await api.business().deleteComplement(businessId!, complementId);
  };

  return (
    <ProductContext.Provider
      value={{
        productId,
        product,
        productConfig,
        sortedGroups,
        onSaveProduct,
        onDeleteProduct,
        onSaveComplementsGroup,
        onUpdateComplementsGroup,
        onDeleteComplementsGroup,
        onSaveComplement,
        onDeleteComplement,
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
