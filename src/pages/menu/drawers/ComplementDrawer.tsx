import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useComplementImage } from 'app/api/business/complements/useComplementImage';
import { useContextMenu } from 'app/state/menu/context';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ImageUploads } from 'common/components/ImageUploads';
import {
  complementsRatios,
  complementsResizedWidth,
} from 'common/imagesDimensions';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'utils/functions';
import { t } from 'utils/i18n';
import { GroupSelect } from '../complements/GroupSelect';
import { ItemsQtdButtons } from '../complements/ItemQtdButtons';
import { DrawerButtons } from '../drawers/DrawerButtons';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  complementId: string;
};

export const ComplementDrawer = ({ onClose, ...props }: Props) => {
  //context
  const query = useQuery();
  const { complementId } = useParams<Params>();
  const {
    getComplementData,
    updateComplement,
    updateComplementResult,
    deleteComplement,
  } = useContextMenu();
  //context
  const hookImageUrl = useComplementImage(complementId);
  const { isLoading } = updateComplementResult;
  // state
  const [groupId, setGroupId] = React.useState<string>();
  const { group, complement } = getComplementData(complementId, groupId);
  const [name, setName] = React.useState('');
  const [parentId, setParentId] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [externalId, setExternalId] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File[] | null>(null);
  const [imageExists, setImageExists] = React.useState(false);
  const [maximum, setMaximum] = React.useState(1);
  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  //handlers
  const clearDropImages = React.useCallback(() => {
    setImageFile(null);
    setImageExists(false);
  }, []);
  const getImageFiles = React.useCallback(async (files: File[]) => {
    setImageFile(files);
    setImageExists(true);
  }, []);
  const handleSave = async () => {
    const newItem = {
      name,
      description,
      price,
      maximum,
      externalId,
      imageExists,
    };
    await updateComplement({
      groupId,
      complementId,
      changes: newItem,
      imageFile: imageFile ? imageFile[0] : null,
    });
    onClose();
  };
  const handleDelete = async () => {
    if (!complementId || !deleteComplement) return;
    await deleteComplement({ complementId, imageExists });
    onClose();
  };
  // side effects
  React.useEffect(() => {
    if (!query) return;
    if (groupId) return;
    const paramsId = query.get('groupId');
    if (paramsId) setGroupId(paramsId);
  }, [query, groupId]);
  React.useEffect(() => {
    if (!group?.id) return;
    setGroupId(group.id);
  }, [group?.id]);
  React.useEffect(() => {
    inputRef?.current?.focus();
    if (complement) {
      setName(complement.name);
      setDescription(complement.description ?? '');
      setPrice(complement.price);
      setExternalId(complement.externalId ?? '');
      setImageExists(complement.imageExists ?? false);
      setMaximum(complement.maximum ?? 1);
    }
    if (groupId) setParentId(groupId);
  }, [complement, groupId]);
  React.useEffect(() => {
    if (hookImageUrl) {
      setImageUrl(hookImageUrl);
    }
  }, [hookImageUrl]);
  // UI
  return (
    <BaseDrawer
      title={
        complementId === 'new'
          ? t('Adicionar complemento')
          : t('Editar complemento')
      }
      onSubmitHandler={handleSave}
      footer={() => (
        <DrawerButtons
          type="complemento"
          isEditing={complementId !== 'new'}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
      onClose={onClose}
      {...props}
    >
      <VStack spacing={4} alignItems="flex-start">
        <Text fontSize="lg" fontWeight="700" color="black">
          {t('Complemento:')}
        </Text>
        <HStack w="100%" spacing={4} alignItems="flex-end">
          <Flex flexDir="column">
            <ImageUploads
              width={200}
              height={200}
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
        </HStack>
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
          <GroupSelect
            isRequired
            value={parentId}
            onChange={(ev) => setParentId(ev.target.value)}
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
              aria-label={t('preço-do-novo-complemento')}
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
          <HStack
            mt="3"
            w="100%"
            spacing={4}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Text>{t('Qtd. máxima deste complemento por pedido:')}</Text>
            <ItemsQtdButtons
              size="sm"
              value={maximum}
              increment={() =>
                setMaximum((prev) => {
                  if (group?.maximum && prev < group.maximum) return prev + 1;
                  else return prev;
                })
              }
              decrement={() =>
                setMaximum((prev) => {
                  if (prev > 1) return prev - 1;
                  else return prev;
                })
              }
            />
          </HStack>
        </Flex>
      </VStack>
    </BaseDrawer>
  );
};
