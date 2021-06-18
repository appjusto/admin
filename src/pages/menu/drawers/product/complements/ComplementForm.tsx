import { Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Complement, WithId } from 'appjusto-types';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ImageUploads } from 'common/components/ImageUploads';
import { complementsRatios, complementsResizedWidth } from 'common/imagesDimensions';
import { useProductContext } from 'pages/menu/context/ProductContext';
import React from 'react';
import { t } from 'utils/i18n';

interface ComplementFormProps {
  groupId?: string;
  complementId?: string;
  item?: WithId<Complement>;
  onSuccess(): void;
  onCancel(): void;
}

export const ComplementForm = ({
  groupId,
  complementId,
  item,
  onSuccess,
  onCancel,
}: ComplementFormProps) => {
  //context
  const { onSaveComplement, getComplementImageUrl } = useProductContext();
  //state
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [externalId, setExternalId] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File[] | null>(null);
  const [imageExists, setImageExists] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  //handlers
  const getImageUrl = React.useCallback(async () => {
    const url = await getComplementImageUrl(complementId!);
    if (url) return setImageUrl(url);
  }, [complementId, getComplementImageUrl]);

  const clearDropImages = React.useCallback(() => {
    setImageFile(null);
    setImageExists(false);
  }, []);

  const getImageFiles = React.useCallback(async (files: File[]) => {
    setImageFile(files);
    setImageExists(true);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const newItem = {
      name,
      description,
      price,
      externalId,
      imageExists,
    };
    await onSaveComplement(
      groupId as string,
      complementId as string,
      newItem,
      imageFile ? imageFile[0] : null
    );
    setIsLoading(false);
    onSuccess();
  };

  //side effects
  React.useEffect(() => {
    inputRef?.current?.focus();
    if (item) {
      setName(item.name);
      setDescription(item.description ?? '');
      setPrice(item.price);
      setExternalId(item.externalId ?? '');
      setImageExists(item.imageExists ?? false);
    }
  }, [item]);

  React.useEffect(() => {
    if (item?.imageExists) {
      getImageUrl();
    }
  }, [item?.imageExists, getImageUrl]);

  //UI
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        handleSave();
      }}
    >
      <VStack spacing={4} alignItems="flex-start" p="4">
        <Flex flexDir="column">
          <ImageUploads
            width="200px"
            height="200px"
            imageUrl={imageUrl}
            ratios={complementsRatios}
            resizedWidth={complementsResizedWidth}
            getImages={getImageFiles}
            clearDrop={clearDropImages}
          />
          <Text mt="2" textAlign="center" fontSize="xs">
            {t('Adicionar imagem')}
          </Text>
        </Flex>
        <Flex flexDir="column" w="100%">
          <Input
            ref={inputRef}
            isRequired
            mt="0"
            id="complements-item-name"
            label={t('Nome do item')}
            placeholder={t('Nome do item')}
            value={name}
            handleChange={(ev) => setName(ev.target.value)}
          />
          <Textarea
            mt="4"
            id="complements-item-description"
            label={t('Descrição do item')}
            placeholder={t('Descreva seu item')}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            maxH="130px"
          />
          <Text fontSize="xs" color="gray.700">
            0/1000
          </Text>
          <HStack spacing={4} mt="4">
            <CurrencyInput
              mt="0"
              id="complements-item-price"
              label={t('Preço')}
              value={price}
              onChangeValue={(value) => setPrice(value)}
              maxLength={5}
            />
            <Input
              id="complements-item-pdv"
              label={t('Código PDV')}
              placeholder={t('000')}
              value={externalId}
              handleChange={(ev) => setExternalId(ev.target.value)}
            />
          </HStack>
          <Flex mt="4" justifyContent="flex-end">
            <Button variant="dangerLight" w="120px" mr="4" onClick={onCancel}>
              {t('Cancelar')}
            </Button>
            <Button type="submit" w="120px" isLoading={isLoading} loadingText={t('Salvando')}>
              {t('Salvar')}
            </Button>
          </Flex>
        </Flex>
      </VStack>
    </form>
  );
};
