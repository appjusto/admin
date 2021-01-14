import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Text } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useProduct } from 'app/api/business/products/useProduct';
import { useContextMenu } from 'app/state/menu/context';
import { FileDropzone } from 'common/components/FileDropzone';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';
import { DrawerButtons } from './DrawerButtons';
import { CategorySelect } from './product/CategorySelect';

interface Params {
  productId: string;
}

interface Props {
  isOpen: boolean;
  onClose(): void;
}

export const ProductDrawer = (props: Props) => {
  // context
  const { productId } = useParams<Params>();

  // state
  const { menuConfig, updateMenuConfig } = useContextMenu();
  const { product, id, isNew, saveProduct, uploadPhoto, deleteProduct, result } = useProduct(
    productId
  );
  const { isLoading, isError, error } = result;
  const [name, setName] = React.useState(product?.name ?? '');
  const [categoryId, setCategoryId] = React.useState<string | undefined>();
  const [description, setDescription] = React.useState(product?.description ?? '');
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    product?.image_url ?? undefined
  );
  const [price, setPrice] = React.useState(product?.price ?? 0);
  const [externalId, setExternalId] = React.useState(product?.externalId ?? '');
  const [enabled, setEnabled] = React.useState(product?.enabled ?? true);
  const [previewURL, setPreviewURL] = React.useState<string | undefined>();
  // side effects
  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(menu.getProductCategoryId(menuConfig, id));
      setDescription(product.description ?? '');
      setImageUrl(product.image_url ?? '');
      setPrice(product.price ?? 0);
      setPrice(product.price ?? 0);
      setExternalId(product.externalId ?? '');
      setEnabled(product.enabled ?? true);
    }
  }, [id, product, menuConfig]);
  // handlers
  const onDropHandler = React.useCallback(
    async (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      const url = URL.createObjectURL(file);
      uploadPhoto(file);
      setPreviewURL(url);
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
      title={isNew ? t('Adicionar produto') : t('Alterar produto')}
      initialFocusRef={inputRef}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSaveHandler();
        }}
      >
        <Input
          isRequired
          id="product-drawer-name"
          ref={inputRef}
          value={name}
          label={t('Nome')}
          placeholder={t('Nome do produto')}
          onChange={(ev) => setName(ev.target.value)}
        />

        <Box mt="4">
          <CategorySelect
            isRequired
            value={categoryId}
            onChange={(ev) => setCategoryId(ev.target.value)}
          />
        </Box>

        <Box mt="4">
          <Textarea
            isRequired
            id="product-drawer-description"
            value={description}
            label={t('Descrição')}
            placeholder={t('Descreva seu produto')}
            onChange={(ev) => setDescription(ev.target.value)}
            maxLength={1000}
          />
          <Text fontSize="xs" color="gray.700">
            {description.length}/1000
          </Text>
        </Box>

        <Box mt="4">
          <CurrencyInput
            isRequired
            id="drawer-price"
            value={price}
            label={t('Preço')}
            placeholder={t('0,00')}
            onChangeValue={(value) => setPrice(value)}
          />
        </Box>

        <FileDropzone mt="4" onDropFile={onDropHandler} preview={previewURL ?? imageUrl} />
        <DrawerButtons
          type="product"
          isEditing={product ? true : false}
          onDelete={onDeleteHandler}
          isLoading={isLoading}
        />
        {isError && (
          <Box mt="6">
            {isError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                <AlertDescription>{getErrorMessage(error) ?? t('Tenta de novo?')}</AlertDescription>
              </Alert>
            )}
          </Box>
        )}
      </form>
    </BaseDrawer>
  );
};
