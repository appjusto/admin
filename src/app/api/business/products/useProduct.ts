import * as menu from '@appjusto/menu';
import { Ordering, Product } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useQueryClient } from 'react-query';
import { useContextApi } from '../../../state/api/context';

export const useProduct = (
  businessId: string | undefined,
  contextCategoryId: string | undefined,
  productId: string,
  productsOrdering: Ordering,
  updateProductsOrdering: (ordering: Ordering) => void
) => {
  // context
  const api = useContextApi()!;
  const queryClient = useQueryClient();
  // mutations
  const { mutateAsync: updateProduct, mutationResult: updateProductResult } =
    useCustomMutation(
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
          id = await api
            .business()
            .createProduct(businessId!, newProduct, data.imageFiles);
        } else {
          await api
            .business()
            .updateProduct(businessId!, productId, newProduct, data.imageFiles);
        }
        if (data.categoryId)
          updateProductsOrdering(
            menu.updateParent(productsOrdering, id, data.categoryId)
          );
        if (data.imageFiles)
          queryClient.invalidateQueries(['product:image', productId]);
        return id;
      },
      'updateProduct'
    );

  const { mutateAsync: deleteProduct, mutationResult: deleteProductResult } =
    useCustomMutation(async () => {
      if (contextCategoryId) {
        updateProductsOrdering(
          menu.removeSecondLevel(productsOrdering, productId, contextCategoryId)
        );
      }
      await api.business().deleteProduct(businessId!, productId);
    }, 'deleteProduct');

  // complements groups
  const {
    mutateAsync: connectComplmentsGroupToProduct,
    mutationResult: connectionResult,
  } = useCustomMutation(async (data: { groupsIds: string[] }) => {
    if (!data.groupsIds) {
      throw new Error(`Argumentos inválidos: groupsIds: ${data.groupsIds}.`);
    }
    await api.business().updateProduct(businessId!, productId, {
      complementsGroupsIds: data.groupsIds,
    });
  }, 'connectComplmentsGroupToProduct');

  return {
    updateProduct,
    updateProductResult,
    deleteProduct,
    deleteProductResult,
    connectComplmentsGroupToProduct,
    connectionResult,
  };
};
