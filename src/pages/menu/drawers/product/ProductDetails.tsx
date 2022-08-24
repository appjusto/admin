import {
  Box,
  Button,
  CheckboxGroup,
  Flex,
  Link,
  Stack,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useClassifications } from 'app/api/platform/useClassifications';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ImageUploads } from 'common/components/ImageUploads';
import { productRatios, productResizedWidth } from 'common/imagesDimensions';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { slugfyName } from 'utils/functions';
import { t } from 'utils/i18n';
import { CategorySelect } from './CategorySelect';

export const ProductDetails = () => {
  //context
  const { url } = useRouteMatch();
  const { push } = useHistory();
  const {
    productId,
    state,
    handleStateUpdate,
    handleProductUpdate,
    clearState,
    imageUrl,
  } = useProductContext();
  const platformClassifications = useClassifications();
  //state
  const { product, categoryId, saveSuccess } = state;
  const { name, description, price, classifications, externalId, enabled } =
    product;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const clearDropImages = React.useCallback(() => {
    handleStateUpdate({ imageFiles: null });
    handleProductUpdate({ imageExists: false });
  }, [handleStateUpdate, handleProductUpdate]);

  const handleImageFiles = React.useCallback(
    (files: File[]) => {
      handleStateUpdate({ imageFiles: files });
      handleProductUpdate({ imageExists: true });
    },
    [handleStateUpdate, handleProductUpdate]
  );

  const handleSaveOther = React.useCallback(() => {
    clearState();
    const newUrl = url.replace(productId, 'new');
    push(newUrl);
  }, [clearState, url, push, productId]);

  //UI
  if (saveSuccess) {
    return (
      <Flex flexDir="column">
        <Text fontSize="lg" fontWeight="700">
          {t('Produto salvo com sucesso!')}
        </Text>
        <Text>{t('O que gostaria de fazer agora?')}</Text>
        <Stack
          mt="4"
          w="100%"
          direction={{ base: 'column', md: 'row' }}
          spacing="4"
        >
          <Button
            fontSize="15px"
            onClick={handleSaveOther}
            variant="outline"
            w="100%"
          >
            {t('Salvar um novo produto')}
          </Button>
          <Link as={RouterLink} to={`${url}/complements`} w="100%">
            <Button fontSize="15px" variant="outline" w="100%">
              {t('Adicionar complementos')}
            </Button>
          </Link>
        </Stack>
      </Flex>
    );
  }
  return (
    <Box>
      <Input
        isRequired
        id="product-drawer-name"
        ref={inputRef}
        value={name}
        label={t('Nome')}
        placeholder={t('Nome do produto')}
        onChange={(ev) => handleProductUpdate({ name: ev.target.value })}
      />
      <CategorySelect
        isRequired
        value={categoryId}
        onChange={(ev) => handleStateUpdate({ categoryId: ev.target.value })}
      />
      <Textarea
        isRequired
        id="product-drawer-description"
        value={description}
        label={t('Descrição')}
        placeholder={t('Descreva seu produto')}
        onChange={(ev) => handleProductUpdate({ description: ev.target.value })}
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
        aria-label={t('preço-do-novo-produto')}
        placeholder={t('0,00')}
        onChangeValue={(value) => handleProductUpdate({ price: value })}
        maxLength={6}
      />
      <Text mt="8" fontSize="sm" color="black">
        {t(
          'Caso possua um sistema de controle de PDV, insira o código abaixo:'
        )}
      </Text>
      <Input
        id="product-pdv"
        mt="2"
        maxW="220px"
        label="Código PDV"
        placeholder="000"
        value={externalId ? externalId : ''}
        handleChange={(ev) =>
          handleProductUpdate({ externalId: ev.target.value })
        }
      />
      <Text mt="8" fontSize="xl" color="black">
        {t('Imagem do produto')}
      </Text>
      <Text>
        {t(
          'Recomendamos imagens na proporção retangular (16:9) com no mínimo 1280px de largura'
        )}
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
        onChange={(value) =>
          handleProductUpdate({ classifications: value as string[] })
        }
      >
        <VStack alignItems="flex-start" mt="4" color="black" spacing={2}>
          {platformClassifications.map((item) => (
            <CustomCheckbox
              key={item.id}
              value={item.name}
              aria-label={`${slugfyName(item.name)}-checkbox`}
            >
              {item.name}
            </CustomCheckbox>
          ))}
        </VStack>
      </CheckboxGroup>{' '}
      <Flex mt="8" flexDir="row" alignItems="center">
        <Switch
          isChecked={enabled}
          onChange={(ev) => {
            ev.stopPropagation();
            handleProductUpdate({ enabled: ev.target.checked });
          }}
        />
        <Text ml="4" color="black">
          {t('Ativar produto após a criação')}
        </Text>
      </Flex>
    </Box>
  );
};
