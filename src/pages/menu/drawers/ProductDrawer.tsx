import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Text } from '@chakra-ui/react';
import { useProduct } from 'app/api/menu/products/useProduct';
import { getErrorMessage } from 'app/api/utils';
import { FileDropzone } from 'common/components/FileDropzone';
import { Input } from 'common/components/Input';
import { Textarea } from 'common/components/Textarea';
import i18n from 'i18n-js';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';

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
  const isNew = productId === 'new';

  // state
  const {
    product,
    image,
    createProduct,
    updateProduct,
    uploadPhoto,
    addToCategory,
    isLoading,
    isError,
    error,
  } = useProduct(productId);
  const [name, setName] = React.useState(product?.name ?? '');
  const [description, setDescription] = React.useState(product?.description ?? '');
  const [price, setPrice] = React.useState(product?.price ?? 0);
  const [priceText, setPriceText] = React.useState(i18n.toCurrency(price));
  const [externalId, setExternalId] = React.useState(product?.externalId ?? '');
  const [enabled, setEnabled] = React.useState(product?.enabled ?? true);
  const [previewURL, setPreviewURL] = React.useState<string | undefined>();

  console.log(image);

  // side effects
  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description ?? '');
      setPrice(product.price ?? 0);
      setPriceText(i18n.toCurrency(product.price ?? 0));
      setExternalId(product.externalId ?? '');
      setEnabled(product.enabled ?? true);
    }
  }, [product]);

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
      if (isNew) {
        await createProduct({
          name,
          description,
          externalId,
          price,
          enabled,
        });
        await addToCategory('a');
      } else {
        await updateProduct({
          name,
          description,
          externalId,
          price,
          enabled,
        });
      }
      props.onClose();
    })();
  };

  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);

  // UI
  return (
    <BaseDrawer
      {...props}
      title={t('Adicionar produto')}
      initialFocusRef={inputRef}
      onSave={onSaveHandler}
      isLoading={isLoading}
    >
      <Input
        ref={inputRef}
        value={name}
        label={t('Nome')}
        placeholder={t('Nome do produto')}
        onChange={(ev) => setName(ev.target.value)}
      />

      <Box mt="4">
        <Textarea
          value={description}
          label={t('Descrição')}
          placeholder={t('Descreva seu produto')}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <Text fontSize="xs" color="gray.700">
          {description.length}/1000
        </Text>
      </Box>

      <Box mt="4">
        <Input
          value={priceText}
          label={t('Preço')}
          placeholder={t('0,00')}
          onChange={(ev) => setPriceText(ev.target.value)}
          onFocus={() => setPriceText(i18n.toNumber(price, { delimiter: ',', precision: 2 }))}
          onBlur={() => {
            const sanitizedPrice = priceText.replace(',', '.');
            const priceAsNumber = parseFloat(sanitizedPrice);
            const newPrice = !isNaN(priceAsNumber) ? priceAsNumber : 0;
            setPrice(newPrice);
            setPriceText(i18n.toCurrency(newPrice));
          }}
        />
      </Box>

      <FileDropzone mt="4" onDropFile={onDropHandler} preview={previewURL ?? image} />

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
    </BaseDrawer>
  );
};
