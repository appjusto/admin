import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Link,
  Stack,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import * as menu from 'app/api/business/menu/functions';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ImageUploads } from 'common/components/ImageUploads';
import { productRatios, productResizedWidth } from 'common/imagesDimensions';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { t } from 'utils/i18n';
import { DrawerButtons } from '../DrawerButtons';
import { CategorySelect } from './CategorySelect';
import { productReducer } from './productReducer';

const initialState = {
  //product
  name: '',
  description: '',
  price: 0,
  classifications: [],
  externalId: '',
  enabled: true,
  complementsOrder: menu.empty(),
  complementsEnabled: false,
  imageExists: false,
  //details
  categoryId: '',
  imageFiles: null,
  isLoading: false,
  isEditing: false,
  saveSuccess: false,
};

interface DetailsProps {
  onClose(): void;
}

export const ProductDetails = ({ onClose }: DetailsProps) => {
  //context
  const query = useQuery();
  const { url, path } = useRouteMatch();
  const { push } = useHistory();
  const {
    contextCategoryId,
    productId,
    product,
    isValid,
    imageUrl,
    updateProduct,
    deleteProduct,
  } = useProductContext();
  //state
  const [state, dispatch] = React.useReducer(productReducer, initialState);
  const {
    //product
    name,
    description,
    price,
    classifications,
    externalId,
    enabled,
    complementsOrder,
    complementsEnabled,
    imageExists,
    //details
    categoryId,
    imageFiles,
    isLoading,
    isEditing,
    saveSuccess,
  } = state;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  //handlers
  const handleStateUpdate = (key: string, value: any) => {
    dispatch({ type: 'update_state', payload: { [key]: value } });
  };

  const clearState = () => {
    dispatch({ type: 'update_state', payload: initialState });
  };

  const clearDropImages = React.useCallback(() => {
    dispatch({
      type: 'update_state',
      payload: {
        imageFiles: null,
        imageExists: false,
      },
    });
  }, []);

  const handleImageFiles = React.useCallback((files: File[]) => {
    handleStateUpdate('imageFiles', files);
    handleStateUpdate('imageExists', true);
  }, []);

  const onSave = () => {
    if (price === 0) {
      priceRef.current?.focus();
      return;
    }
    handleStateUpdate('isLoading', true);
    (async () => {
      const newId = await updateProduct({
        changes: {
          name,
          description,
          price,
          classifications,
          externalId,
          enabled,
          complementsOrder,
          complementsEnabled,
          imageExists,
        },
        categoryId,
        imageFiles,
      });
      handleStateUpdate('isLoading', false);
      if (url.includes('new') && newId) {
        const newUrl = url.replace('new', newId);
        push(newUrl);
        handleStateUpdate('saveSuccess', true);
      } else {
        onClose();
      }
    })();
  };

  const handleSaveOther = () => {
    clearState();
    const newUrl = url.replace(productId, 'new');
    push(newUrl);
  };

  const handleDelete = async () => {
    deleteProduct();
    onClose();
  };

  //side effects
  React.useEffect(() => {
    if (!isValid) {
      const newPath = path.replace(':productId', 'new');
      push(newPath);
    }
  }, [isValid, path, push, url]);

  React.useEffect(() => {
    if (product && productId !== 'new') {
      dispatch({
        type: 'update_state',
        payload: {
          name: product.name ?? '',
          description: product.description ?? '',
          price: product.price ?? 0,
          classifications: product.classifications ?? [],
          externalId: product.externalId ?? '',
          enabled: product.enabled ?? true,
          complementsOrder: product.complementsOrder,
          complementsEnabled: product.complementsEnabled ?? false,
          imageExists: product.imageExists ?? false,
          categoryId: contextCategoryId ?? '',
          isEditing: productId === 'new' ? false : true,
        },
      });
    }
  }, [product, productId, contextCategoryId]);

  React.useEffect(() => {
    if (!query) return;
    if (categoryId) return;
    const paramsId = query.get('categoryId');
    if (paramsId) dispatch({ type: 'update_state', payload: { categoryId: paramsId } });
  }, [query, categoryId]);

  //UI
  if (saveSuccess) {
    return (
      <Flex flexDir="column">
        <Text fontSize="lg" fontWeight="700">
          {t('Produto salvo com sucesso!')}
        </Text>
        <Text>{t('O que gostaria de fazer agora?')}</Text>
        <Stack mt="4" w="100%" direction={{ base: 'column', md: 'row' }} spacing="4">
          <Button onClick={handleSaveOther} variant="outline" w="100%">
            {t('Salvar um novo produto')}
          </Button>
          <Link as={RouterLink} to={`${url}/complements`} w="100%">
            <Button variant="outline" w="100%">
              {t('Adicionar complementos')}
            </Button>
          </Link>
        </Stack>
      </Flex>
    );
  }
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSave();
      }}
    >
      <Input
        isRequired
        id="product-drawer-name"
        ref={inputRef}
        value={name}
        label={t('Nome')}
        placeholder={t('Nome do produto')}
        onChange={(ev) => handleStateUpdate('name', ev.target.value)}
      />
      <CategorySelect
        isRequired
        value={categoryId}
        onChange={(ev) => handleStateUpdate('categoryId', ev.target.value)}
      />
      <Textarea
        isRequired
        id="product-drawer-description"
        value={description}
        label={t('Descrição')}
        placeholder={t('Descreva seu produto')}
        onChange={(ev) => handleStateUpdate('description', ev.target.value)}
        maxLength={1000}
      />
      <Text fontSize="xs" color="gray.700">
        {description?.length}/1000
      </Text>
      <CurrencyInput
        ref={priceRef}
        isRequired
        maxW="220px"
        id="drawer-price"
        value={price}
        label={t('Preço')}
        placeholder={t('0,00')}
        onChangeValue={(value) => handleStateUpdate('price', value)}
        maxLength={6}
      />
      <Text mt="8" fontSize="sm" color="black">
        {t('Caso possua um sistema de controle de PDV, insira o código abaixo:')}
      </Text>
      <Input
        id="product-pdv"
        mt="2"
        maxW="220px"
        label="Código PDV"
        placeholder="000"
        value={externalId ? externalId : ''}
        handleChange={(ev) => handleStateUpdate('externalId', ev.target.value)}
      />
      <Text mt="8" fontSize="xl" color="black">
        {t('Imagem do produto')}
      </Text>
      <Text>
        {t('Recomendamos imagens na proporção retangular (16:9) com no mínimo 1280px de largura')}
      </Text>
      <ImageUploads
        mt="4"
        width={464}
        height={332}
        imageUrl={imageUrl}
        ratios={productRatios}
        resizedWidth={productResizedWidth}
        placeholderText={t('Imagem do produto')}
        getImages={handleImageFiles}
        clearDrop={clearDropImages}
      />
      <Text mt="8" fontSize="xl" color="black">
        {t('Classificações adicionais:')}
      </Text>
      <CheckboxGroup
        colorScheme="green"
        value={classifications}
        onChange={(value) => handleStateUpdate('classifications', value)}
      >
        <VStack alignItems="flex-start" mt="4" color="black" spacing={2}>
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
            handleStateUpdate('enabled', ev.target.checked);
          }}
        />
        <Text ml="4" color="black">
          {t('Ativar produto após a criação')}
        </Text>
      </Flex>
      <DrawerButtons
        type="produto"
        isEditing={isEditing}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </form>
  );
};
