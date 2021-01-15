import * as menu from 'app/api/business/menu/functions';
import { useProduct } from 'app/api/business/products/useProduct';
import { useContextMenu } from 'app/state/menu/context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';
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
  pdvCod: '',
  classifications: [],
  imageUrl: '',
  previewURL: '',
  externalId: '',
  enabled: true,
  productPage: 'detail',
};

export const ProductDrawer = (props: Props) => {
  // context
  const { productId } = useParams<Params>();

  // state
  const { menuConfig, updateMenuConfig } = useContextMenu();
  const { product, id, isNew, saveProduct, uploadPhoto, deleteProduct, result } = useProduct(
    productId
  );
  const { isLoading, isError, error } = result;

  const [state, dispatch] = React.useReducer(productReducer, initialState);
  const {
    name,
    categoryId,
    description,
    price,
    pdvCod,
    classifications,
    imageUrl,
    previewURL,
    externalId,
    enabled,
    productPage,
  } = state;
  // side effects
  React.useEffect(() => {
    if (product) {
      dispatch({
        type: 'update_state',
        payload: {
          name: product.name,
          categoryId: menu.getProductCategoryId(menuConfig, id),
          description: product.description ?? '',
          price: product.price ?? 0,
          pdvCod: product.pdv ?? '',
          classifications: product.classifications ?? [],
          imageUrl: product.image_url ?? '',
          externalId: product.externalId ?? '',
          enabled: product.enabled ?? true,
        },
      });
    }
  }, [id, product, menuConfig]);
  // handlers
  const onDropHandler = React.useCallback(
    async (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      const url = URL.createObjectURL(file);
      uploadPhoto(file);
      dispatch({ type: 'update_state', payload: { previewURL: url } });
    },
    [uploadPhoto]
  );

  const onSaveHandler = () => {
    (async () => {
      await saveProduct({
        name,
        description,
        externalId,
        price,
        enabled,
        pdv: pdvCod,
        classifications,
      });
      updateMenuConfig(menu.updateProductCategory(menuConfig, id, categoryId!));
      props.onClose();
    })();
  };
  const onDeleteHandler = () => {
    (async () => {
      if (categoryId) {
        updateMenuConfig(menu.removeProductFromCategory(menuConfig, id, categoryId));
        await deleteProduct();
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
      productPage={productPage}
      setProductPage={(value: string) =>
        dispatch({ type: 'update_state', payload: { productPage: value } })
      }
      title={isNew ? t('Adicionar produto') : t('Alterar produto')}
      isLoading={isLoading}
      isEditing={product ? true : false}
      onSave={onSaveHandler}
      onDelete={onDeleteHandler}
      initialFocusRef={inputRef}
      isError={isError}
      error={error}
    >
      <ProductDetails
        state={state}
        handleChange={(key, value) => dispatch({ type: 'update_state', payload: { [key]: value } })}
        inputRef={inputRef}
        onDropHandler={onDropHandler}
      />
    </BaseDrawer>
  );
};
