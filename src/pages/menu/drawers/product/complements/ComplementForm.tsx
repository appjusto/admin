import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Complement, WithId } from 'appjusto-types';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ImageUploads } from 'common/components/ImageUploads';
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
  const [previewURL, setPreviewURL] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File[] | null>(null);
  const [imageExists, setImageExists] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasImage = React.useRef(false);

  const getImageUrl = React.useCallback(async () => {
    const url = await getComplementImageUrl(complementId!);
    if (url) return setPreviewURL(url);
  }, [complementId, getComplementImageUrl]);

  //handlres
  const onDropHandler = React.useCallback(async (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    const url = URL.createObjectURL(file);
    hasImage.current = false;
    setPreviewURL(url);
  }, []);

  const clearDropImages = () => {
    hasImage.current = false;
    setPreviewURL(null);
    setImageFile(null);
    setImageExists(false);
  };

  const handleCropImages = async (files: File[]) => {
    setImageFile(files);
    setImageExists(true);
  };

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
    }
  }, [item]);

  React.useEffect(() => {
    if (item?.imageExists) {
      getImageUrl();
      hasImage.current = true;
    }
  }, [item?.imageExists, getImageUrl]);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        handleSave();
      }}
    >
      <HStack spacing={4} alignItems="flex-start" p="4">
        <Flex flexDir="column" maxW="24">
          <ImageUploads
            width={86}
            height={86}
            onDropFile={onDropHandler}
            preview={previewURL}
            ratios={[1 / 1]}
            resizedWidth={[288]}
            hasImage={hasImage.current}
            onCropEnd={handleCropImages}
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
            isRequired
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
              maxLength={4}
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
      </HStack>
    </form>
  );
};
