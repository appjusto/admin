import { Checkbox, CheckboxGroup, Flex, Switch, Text, VStack } from '@chakra-ui/react';
import { FileDropzone } from 'common/components/FileDropzone';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput2';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import { CustomTextarea as Textarea } from 'common/components/form/input/CustomTextarea';
import React from 'react';
import { t } from 'utils/i18n';
import { DrawerButtons } from '../DrawerButtons';
import { CategorySelect } from './CategorySelect';
import { StateProps } from './productReducer';

interface ProductDetailsProps {
  state: StateProps;
  handleStateUpdate(key: string, value: string | number | React.ReactText[] | boolean): void;
  inputRef: React.RefObject<HTMLInputElement> | null | undefined;
  onDropHandler: (acceptedFiles: File[]) => Promise<void>;
  isEditing: boolean;
  onSave(): void;
  onDelete(): void;
}

export const ProductDetails = ({
  state,
  handleStateUpdate,
  onDropHandler,
  inputRef,
  isEditing,
  onSave,
  onDelete,
}: ProductDetailsProps) => {
  const {
    name,
    categoryId,
    description,
    price,
    classifications,
    imageUrl,
    previewURL,
    externalId,
    enabled,
  } = state;
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        setIsLoading(true);
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
        isRequired
        maxW="220px"
        id="drawer-price"
        value={price}
        label={t('Preço')}
        placeholder={t('0,00')}
        onChangeValue={(value) => handleStateUpdate('price', value)}
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
      <FileDropzone mt="4" onDropFile={onDropHandler} preview={previewURL ?? imageUrl} />
      <Text mt="8" fontSize="xl" color="black">
        {t('Classificações adicionais:')}
      </Text>
      <CheckboxGroup
        colorScheme="green"
        value={classifications}
        onChange={(value) => handleStateUpdate('classifications', value)}
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
            handleStateUpdate('enabled', ev.target.checked);
          }}
        />
        <Text ml="4" color="black">
          {t('Ativar produto após a criação')}
        </Text>
      </Flex>
      <DrawerButtons
        type="product"
        isEditing={isEditing}
        isLoading={isLoading}
        onDelete={onDelete}
      />
    </form>
  );
};
