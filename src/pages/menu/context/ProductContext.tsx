import * as menu from '@appjusto/menu';
import {
  BusinessSchedule,
  ComplementGroup,
  Product,
  WithId,
} from '@appjusto/types';
import { useObserveProduct } from 'app/api/business/products/useObserveProduct';
import { useProduct } from 'app/api/business/products/useProduct';
import { MutationResult } from 'app/api/mutation/useCustomMutation';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import { useContextAppRequests } from 'app/state/requests/context';
import React from 'react';
import { MutateFunction, UseMutateAsyncFunction } from 'react-query';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { productReducer, ProductStateProps } from './productReducer';
import {
  getAvailabilitySchema,
  getMainAvailability,
  getSerializedAvailability,
  schedulesValidation,
} from './utils';

const initialAvailability = [
  { day: 'Segunda', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Terça', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Quarta', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Quinta', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Sexta', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Sábado', checked: true, schedule: [{ from: '', to: '' }] },
  { day: 'Domingo', checked: true, schedule: [{ from: '', to: '' }] },
] as BusinessSchedule;

const initialState = {
  product: {
    name: '',
    description: '',
    price: 0,
    classifications: [],
    externalId: '',
    enabled: true,
    complementsEnabled: false,
    complementsGroupsIds: [],
    imageExists: false,
    availability: initialAvailability,
  },
  // helpers
  categoryId: '',
  imageFiles: null,
  saveSuccess: false,
} as ProductStateProps;

interface Params {
  productId: string;
}

interface ContextProps {
  contextCategoryId: string | undefined;
  productId: string;
  state: ProductStateProps;
  handleStateUpdate: (value: Partial<ProductStateProps>) => void;
  handleProductUpdate: (value: Partial<Product>) => void;
  clearState: () => void;
  imageUrl: string | null;
  sortedGroups: WithId<ComplementGroup>[];
  onProductUpdate: () => Promise<'close_drawer' | void>;
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
  const { dispatchAppRequestResult } = useContextAppRequests();
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
  // product config complements array
  const sortedGroups = complementsGroupsWithItems.filter((group) => false);
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
  const handleStateUpdate = React.useCallback(
    (value: Partial<ProductStateProps>) => {
      dispatch({ type: 'update_state', payload: value });
    },
    []
  );
  const handleProductUpdate = React.useCallback((value: Partial<Product>) => {
    dispatch({ type: 'update_product', payload: value });
  }, []);
  const clearState = React.useCallback(() => {
    dispatch({ type: 'update_state', payload: initialState });
  }, []);
  const onProductUpdate = async () => {
    // product validation
    if (state.product.price === 0) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'ProductPrice-valid',
        message: {
          title: 'É preciso informar um preço maior que zero.',
        },
      });
    }
    // availability validation
    const availability = getSerializedAvailability(
      state.mainAvailability!,
      state.product.availability
    );
    const isValid = schedulesValidation(availability);
    if (!isValid)
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'ProductAvailability-valid',
        message: {
          title: 'Alguns horários de disponibilidade não estão corretos.',
        },
      });
    const {
      name,
      description,
      price,
      classifications,
      externalId,
      enabled,
      imageExists,
      complementsEnabled,
      complementsGroupsIds,
    } = state.product;
    const newId = await updateProduct({
      changes: {
        name,
        description,
        price,
        classifications,
        externalId,
        enabled,
        imageExists,
        complementsEnabled,
        complementsGroupsIds,
        availability,
      },
      categoryId: state.categoryId,
      imageFiles: state.imageFiles,
    });
    if (url.includes('new') && newId) {
      const newUrl = url.replace('new', newId);
      push(newUrl);
      handleStateUpdate({ saveSuccess: true });
      return;
    }
    return 'close_drawer';
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
  React.useEffect(() => {
    if (product && productId !== 'new') {
      dispatch({
        type: 'update_state',
        payload: {
          categoryId: contextCategoryId ?? '',
          mainAvailability: getMainAvailability(product.availability),
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
          imageExists: product.imageExists ?? false,
          complementsEnabled: product.complementsEnabled ?? false,
          complementsGroupsIds: product.complementsGroupsIds ?? [],
          availability: getAvailabilitySchema(
            initialAvailability,
            product.availability
          ),
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
        state,
        handleStateUpdate,
        handleProductUpdate,
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
