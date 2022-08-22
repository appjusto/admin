import * as menu from '@appjusto/menu';
import { ComplementGroup, Product, WithId } from '@appjusto/types';
import { useObserveProduct } from 'app/api/business/products/useObserveProduct';
import { useProduct } from 'app/api/business/products/useProduct';
import { MutationResult } from 'app/api/mutation/useCustomMutation';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import React from 'react';
import { MutateFunction, UseMutateAsyncFunction } from 'react-query';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { productReducer, StateProps } from './productReducer';

const initialState = {
  product: {
    name: '',
    description: '',
    price: 0,
    classifications: [],
    externalId: '',
    enabled: true,
    complementsEnabled: false,
    imageExists: false,
  },
  //details
  categoryId: '',
  imageFiles: null,
  saveSuccess: false,
};

interface Params {
  productId: string;
}

interface ContextProps {
  contextCategoryId: string | undefined;
  productId: string;
  product: WithId<Product> | undefined | null;
  state: StateProps;
  handleStateUpdate: (key: string, value: any) => void;
  clearState: () => void;
  imageUrl: string | null;
  sortedGroups: WithId<ComplementGroup>[];
  onProductUpdate: () => void;
  updateProductResult: MutationResult;
  deleteProduct: UseMutateAsyncFunction<void, unknown, void, unknown>;
  deleteProductResult: MutationResult;
  connectComplmentsGroupToProduct: MutateFunction<
    void,
    unknown,
    {
      groupsIds: string[];
    },
    unknown
  >;
  connectionResult: MutationResult;
}

const ProductContext = React.createContext<ContextProps>({} as ContextProps);

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const ProductContextProvider = (props: ProviderProps) => {
  // context
  const query = useQuery();
  const { url, path } = useRouteMatch();
  const { push } = useHistory();
  const businessId = useContextBusinessId();
  const {
    productsOrdering,
    updateProductsOrdering,
    complementsGroupsWithItems,
  } = useContextMenu();
  const { productId: productIdParam } = useParams<Params>();
  const productId = productIdParam.split('?')[0];
  const { product, imageUrl } = useObserveProduct(
    businessId,
    productId,
    '1008x720'
  );
  const contextCategoryId = menu.getParentId(productsOrdering, productId);
  const sortedGroups = complementsGroupsWithItems.filter((group) => false); // product config complements array
  const {
    updateProduct,
    updateProductResult,
    deleteProduct,
    deleteProductResult,
    connectComplmentsGroupToProduct,
    connectionResult,
  } = useProduct(
    businessId,
    contextCategoryId,
    productId,
    productsOrdering,
    updateProductsOrdering
  );
  //state
  const [state, dispatch] = React.useReducer(productReducer, initialState);
  // handlers
  //handlers
  const handleStateUpdate = (key: string, value: any) => {
    dispatch({ type: 'update_state', payload: { [key]: value } });
  };

  const clearState = () => {
    dispatch({ type: 'update_state', payload: initialState });
  };
  const onProductUpdate = () => {
    // if (price === 0) {
    //   priceRef.current?.focus();
    //   return;
    // }
    (async () => {
      const {
        name,
        description,
        price,
        classifications,
        externalId,
        enabled,
        complementsEnabled,
        imageExists,
      } = state.product;
      const newId = await updateProduct({
        changes: {
          name,
          description,
          price,
          classifications,
          externalId,
          enabled,
          complementsEnabled,
          imageExists,
        },
        categoryId: state.categoryId,
        imageFiles: state.imageFiles,
      });
      if (url.includes('new') && newId) {
        const newUrl = url.replace('new', newId);
        push(newUrl);
        handleStateUpdate('saveSuccess', true);
      } else {
        // onClose();
      }
    })();
  };

  //side effects
  React.useEffect(() => {
    if (product === null) {
      const newPath = path.replace(':productId', 'new');
      push(newPath);
    }
  }, [path, push, product]);

  React.useEffect(() => {
    if (!query) return;
    if (state.categoryId) return;
    const paramsId = query.get('categoryId');
    if (paramsId)
      dispatch({ type: 'update_state', payload: { categoryId: paramsId } });
  }, [query, state.categoryId]);
  // side effects
  React.useEffect(() => {
    if (product && productId !== 'new') {
      dispatch({
        type: 'update_state',
        payload: {
          categoryId: contextCategoryId ?? '',
        },
      });
      dispatch({
        type: 'update_product',
        payload: {
          name: product.name ?? '',
          description: product.description ?? '',
          price: product.price ?? 0,
          classifications: product.classifications ?? [],
          externalId: product.externalId ?? '',
          enabled: product.enabled ?? true,
          complementsEnabled: product.complementsEnabled ?? false,
          imageExists: product.imageExists ?? false,
        },
      });
    }
  }, [product, productId, contextCategoryId]);
  // provider
  return (
    <ProductContext.Provider
      value={{
        contextCategoryId,
        productId,
        product,
        state,
        handleStateUpdate,
        clearState,
        imageUrl,
        sortedGroups,
        onProductUpdate,
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
    throw new Error(
      'useProductContext must be used within the ProductContextProvider'
    );
  }
  return context;
};
