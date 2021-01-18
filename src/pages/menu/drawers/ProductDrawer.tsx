import { useObserveComplements } from 'app/api/business/complements/useObserveComplements';
import * as menu from 'app/api/business/menu/functions';
import { useProduct } from 'app/api/business/products/useProduct2';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextMenu } from 'app/state/menu/context';
import { ComplementGroup } from 'appjusto-types';
import React from 'react';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';
import { ComplementDrawer } from './product/complements/ComplementDrawer';
import { GroupDrawer } from './product/complements/GroupDrawer';
import { ProductDetails } from './product/ProductDetails';
import { productReducer } from './product/productReducer';

interface Params {
  productId: string;
}

interface Props {
  isOpen: boolean;
  onClose(): void;
}

const initialState = {
  name: '',
  categoryId: undefined,
  description: '',
  price: 0,
  classifications: [],
  imageUrl: '',
  previewURL: '',
  externalId: '',
  enabled: true,
  complementsOrder: undefined,
};

export const ProductDrawer = (props: Props) => {
  // params
  const { productId } = useParams<Params>();
  const { path, url } = useRouteMatch();
  const { push } = useHistory();
  const isNew = productId === 'new';
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  // state
  const { menuConfig, updateMenuConfig } = useContextMenu();
  const product = useProduct(businessId, productId);
  const { groups, complements } = useObserveComplements(
    businessId!,
    product?.complementsEnabled === true
  );
  const sortedGroups = menu.getOrderedMenu(groups, complements, product?.complementsOrder);

  const [state, dispatch] = React.useReducer(productReducer, initialState);
  const { name, categoryId, description, price, classifications, externalId, enabled } = state;

  // side effects
  React.useEffect(() => {
    if (product) {
      dispatch({
        type: 'update_state',
        payload: {
          name: product.name,
          categoryId: menu.getProductCategoryId(menuConfig, productId),
          description: product.description ?? '',
          price: product.price ?? 0,
          classifications: product.classifications ?? [],
          imageUrl: product.image_url ?? '',
          externalId: product.externalId ?? '',
          enabled: product.enabled ?? true,
          complementsOrder: product.complementsOrder,
        },
      });
    }
  }, [product, menuConfig, productId]);
  // handlers
  const onDropHandler = React.useCallback(
    async (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      const url = URL.createObjectURL(file);
      api.business().uploadProductPhoto(businessId!, productId, file);
      dispatch({ type: 'update_state', payload: { previewURL: url } });
    },
    [api, businessId, productId]
  );

  const onSaveHandler = () => {
    (async () => {
      const id = await api.business().updateProduct(businessId!, productId, {
        name,
        description,
        externalId,
        price,
        enabled,
        classifications,
      });
      updateMenuConfig(menu.updateProductCategory(menuConfig, id, categoryId!));
      props.onClose();
    })();
  };

  const onSaveComplementsGroup = async (group: ComplementGroup) => {
    (async () => {
      const { complementsOrder } = state;
      const { id: groupId } = await api.business().createComplementsGroup(businessId!, group);
      let changes = {};
      if (complementsOrder) {
        const oldCategoriesOrder = complementsOrder.categoriesOrder ?? [];
        changes = {
          complementsOrder: {
            ...complementsOrder,
            categoriesOrder: [...oldCategoriesOrder, groupId],
          },
        };
      } else {
        changes = {
          complementsOrder: {
            categoriesOrder: [groupId],
          },
        };
      }
      await api.business().updateProduct(businessId!, productId, changes);
      return push(`${url}/complements/${groupId}`);
    })();
  };

  const onDeleteHandler = () => {
    (async () => {
      if (categoryId) {
        updateMenuConfig(menu.removeProductFromCategory(menuConfig, productId, categoryId));
        await api.business().deleteProduct(businessId!, productId);
        props.onClose();
      }
    })();
  };

  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);

  // UI
  return (
    <BaseDrawer
      {...props}
      type="product"
      title={isNew ? t('Adicionar produto') : t('Alterar produto')}
      isLoading={!Boolean(product)}
      isEditing={product ? true : false}
      onSave={onSaveHandler}
      onDelete={onDeleteHandler}
      initialFocusRef={inputRef}
      isError={false}
      error={null}
    >
      <Switch>
        <Route exact path={`${path}`}>
          <ProductDetails
            state={state}
            handleStateUpdate={(key, value) =>
              dispatch({ type: 'update_state', payload: { [key]: value } })
            }
            inputRef={inputRef}
            onDropHandler={onDropHandler}
          />
        </Route>
        <Route exact path={`${path}/complements`}>
          <GroupDrawer onSaveGroup={onSaveComplementsGroup} />
        </Route>
        <Route path={`${path}/complements/:groupId`}>
          <ComplementDrawer onSaveComplement={() => {}} />
        </Route>
      </Switch>
    </BaseDrawer>
  );
};
