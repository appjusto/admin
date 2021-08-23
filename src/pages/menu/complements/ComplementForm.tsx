import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useComplementImage } from 'app/api/business/complements/useComplementImage';
import { Complement, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import { ImageUploads } from 'common/components/ImageUploads';
import { complementsRatios, complementsResizedWidth } from 'common/imagesDimensions';
import React from 'react';
import { MutateFunction, MutationResult } from 'react-query';
import { t } from 'utils/i18n';
import { DrawerButtons } from '../drawers/DrawerButtons';
import { GroupSelect } from './GroupSelect';
import { ItemsQtdButtons } from './ItemQtdButtons';

interface ComplementFormProps {
  groupId?: string;
  groupMaximum?: number;
  complementId?: string;
  item?: WithId<Complement>;
  onSuccess(): void;
  updateComplement: MutateFunction<
    void,
    unknown,
    {
      groupId: string | undefined;
      complementId: string | undefined;
      changes: Complement;
      imageFile?: File | null | undefined;
    },
    unknown
  >;
  updateComplementResult: MutationResult<void, unknown>;
  deleteComplement?: MutateFunction<
    void,
    unknown,
    {
      complementId: string;
      imageExists: boolean;
    },
    unknown
  >;
  deleteComplementResult?: MutationResult<void, unknown>;
}

export const ComplementForm = ({
  groupId,
  groupMaximum,
  complementId,
  item,
  updateComplement,
  updateComplementResult,
  deleteComplement,
  deleteComplementResult,
  onSuccess,
}: ComplementFormProps) => {
  //context
  const hookImageUrl = useComplementImage(complementId);
  const { isLoading } = updateComplementResult;
  //state
  const [name, setName] = React.useState('');
  const [parentId, setParentId] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [externalId, setExternalId] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File[] | null>(null);
  const [imageExists, setImageExists] = React.useState(false);
  const [maximum, setMaximum] = React.useState(1);
  const [error, setError] = React.useState(initialError);
  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  const submission = React.useRef(0);
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
    submission.current += 1;
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
    onSuccess();
  };
  const handleDelete = async () => {
    if (!complementId || !deleteComplement) return;
    submission.current += 1;
    await deleteComplement({ complementId, imageExists });
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
      setMaximum(item.maximum ?? 1);
    }
    if (groupId) setParentId(groupId);
  }, [item, groupId]);
  React.useEffect(() => {
    if (hookImageUrl) {
      setImageUrl(hookImageUrl);
    }
  }, [hookImageUrl]);
  React.useEffect(() => {
    if (updateComplementResult.isError) {
      setError({
        status: true,
        error: updateComplementResult.error,
      });
    } else if (deleteComplementResult?.isError) {
      setError({
        status: true,
        error: deleteComplementResult?.error,
      });
    }
  }, [
    updateComplementResult.isError,
    updateComplementResult.error,
    deleteComplementResult?.isError,
    deleteComplementResult?.error,
  ]);
  //UI
  return (
    <Box>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSave();
        }}
      >
        <VStack spacing={4} alignItems="flex-start" p="4">
          <Text fontSize="lg" fontWeight="700" color="black">
            {t('Complemento:')}
          </Text>
          <HStack w="100%" spacing={4} alignItems="flex-end">
            <Flex flexDir="column">
              <ImageUploads
                width={200} //"200px"
                height={200} //"200px"
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
            <HStack mt="3" w="100%" spacing={4} alignItems="center" justifyContent="flex-end">
              <Text>{t('Qtd. máxima deste complemento por pedido:')}</Text>
              <ItemsQtdButtons
                size="sm"
                value={maximum}
                increment={() =>
                  setMaximum((prev) => {
                    if (groupMaximum && prev < groupMaximum) return prev + 1;
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
            <DrawerButtons
              type="complemento"
              isEditing={complementId !== 'new'}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </Flex>
        </VStack>
      </form>
      <SuccessAndErrorHandler
        submission={submission.current}
        isError={error.status}
        error={error.error}
      />
    </Box>
  );
};
