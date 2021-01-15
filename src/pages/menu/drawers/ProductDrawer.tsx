import { Checkbox, CheckboxGroup, Flex, Switch, Text, VStack } from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { useProduct } from 'app/api/business/products/useProduct';
import { useContextMenu } from 'app/state/menu/context';
import { FileDropzone } from 'common/components/FileDropzone';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput, CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';
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
  const [pdvCod, setPdvCod] = React.useState(product?.pdv ?? '');
  const [classifications, setClassifications] = React.useState<React.ReactText[]>(
    product?.classifications ?? []
  );
  const [externalId, setExternalId] = React.useState(product?.externalId ?? '');
  const [enabled, setEnabled] = React.useState(product?.enabled ?? true);
  const [previewURL, setPreviewURL] = React.useState<string | undefined>();
  const [productPage, setProductPage] = React.useState('detail');
  // side effects
  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(menu.getProductCategoryId(menuConfig, id));
      setDescription(product.description ?? '');
      setImageUrl(product.image_url ?? '');
      setPrice(product.price ?? 0);
      setPrice(product.price ?? 0);
      setPdvCod(product.pdv ?? '');
      setClassifications(product.classifications ?? []);
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
      setProductPage={(value: string) => setProductPage(value)}
      title={isNew ? t('Adicionar produto') : t('Alterar produto')}
      isLoading={isLoading}
      isEditing={product ? true : false}
      onSave={onSaveHandler}
      onDelete={onDeleteHandler}
      initialFocusRef={inputRef}
      isError={isError}
      error={error}
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
      <CategorySelect
        isRequired
        value={categoryId}
        onChange={(ev) => setCategoryId(ev.target.value)}
      />
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
      <CurrencyInput
        isRequired
        maxW="220px"
        id="drawer-price"
        value={price}
        label={t('Preço')}
        placeholder={t('0,00')}
        onChangeValue={(value) => setPrice(value)}
      />
      <Text mt="8" color="black">
        {t('Caso possua um sistema de controle de PDV, insira o código abaixo:')}
      </Text>
      <CustomInput
        id="product-pdv"
        maxW="220px"
        label="Código PDV"
        placeholder="000"
        value={pdvCod}
        handleChange={(ev) => setPdvCod(ev.target.value)}
      />
      <Text mt="8" fontSize="20px" color="black">
        {t('Imagem do produto')}
      </Text>
      <Text>
        {t('Recomendamos imagens na proporção retangular (16:9) com no mínimo 1280px de largura')}
      </Text>
      <FileDropzone mt="4" onDropFile={onDropHandler} preview={previewURL ?? imageUrl} />
      <Text mt="8" fontSize="20px" color="black">
        {t('Classificações adicionais:')}
      </Text>
      <CheckboxGroup
        colorScheme="green"
        value={classifications}
        onChange={(val) => setClassifications(val)}
      >
        <VStack alignItems="flex-start" mt="4" color="Black" spacing={2}>
          <Checkbox iconColor="white" value="vegetarian">
            {t('Vegetariano')}
          </Checkbox>
          <Checkbox iconColor="white" value="vegan">
            {t('Vegano')}
          </Checkbox>
          <Checkbox iconColor="white" value="organic">
            {t('Orgânico')}
          </Checkbox>
          <Checkbox iconColor="white" value="gluten_free">
            {t('Sem glúten')}
          </Checkbox>
          <Checkbox iconColor="white" value="no_sugar">
            {t('Sem açúcar')}
          </Checkbox>
          <Checkbox iconColor="white" value="zero_lactose">
            {t('Zero lactose')}
          </Checkbox>
        </VStack>
      </CheckboxGroup>{' '}
      <Flex mt="8" flexDir="row" alignItems="center" spacing={2}>
        <Switch
          isChecked={enabled}
          onChange={(ev) => {
            ev.stopPropagation();
            setEnabled(ev.target.checked);
          }}
        />
        <Text ml="4" color="black">
          {t('Ativar produto após a criação')}
        </Text>
      </Flex>
    </BaseDrawer>
  );
};
