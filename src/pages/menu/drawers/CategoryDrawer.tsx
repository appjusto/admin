import * as menu from '@appjusto/menu';
import { Text } from '@chakra-ui/react';
import { useCategory } from 'app/api/business/categories/useCategory';
import { useContextMenu } from 'app/state/menu/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';
import { DrawerButtons } from './DrawerButtons';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  categoryId: string;
};

export const CategoryDrawer = (props: Props) => {
  //context
  const { categoryId } = useParams<Params>();
  // state
  const { productsOrdering, updateProductsOrdering } = useContextMenu();
  const {
    category,
    id,
    saveCategory,
    deleteCategory,
    result,
    deleteCategoryResult,
  } = useCategory(categoryId);
  const { isLoading } = result;
  const [name, setName] = React.useState(category?.name ?? '');
  const [externalId, setExternalId] = React.useState(
    category?.externalId ?? ''
  );
  // const [enabled, setEnabled] = React.useState(category?.enabled ?? true);
  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const onSaveHandler = async () => {
    await saveCategory({
      name,
      externalId,
      enabled: true,
    });
    updateProductsOrdering(menu.addFirstLevel(productsOrdering, id));
    props.onClose();
  };
  const onDeleteHandler = async () => {
    updateProductsOrdering(menu.removeFirstLevel(productsOrdering, id));
    await deleteCategory();
    props.onClose();
  };
  // side effects
  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setExternalId(category.externalId ?? '');
      // setEnabled(category.enabled ?? true);
    }
  }, [category]);
  // UI
  return (
    <BaseDrawer
      {...props}
      title={category ? t('Editar categoria') : t('Adicionar categoria')}
      onSubmitHandler={onSaveHandler}
      footer={() => (
        <DrawerButtons
          type="categoria"
          isEditing={categoryId !== 'new'}
          onDelete={onDeleteHandler}
          isLoading={isLoading}
          deletingLoading={deleteCategoryResult.isLoading}
        />
      )}
    >
      <Input
        isRequired
        id="category-drawer-name"
        ref={inputRef}
        value={name}
        label={t('Nome *')}
        placeholder={t('Nome da categoria')}
        onChange={(ev) => setName(ev.target.value)}
      />
      <Text mt="4" fontSize="sm" color="black">
        {t('Código do item no seu sistema de controle de PDV:')}
      </Text>
      <Input
        mt="2"
        id="category-drawer-external-id"
        value={externalId}
        label={t('Código PDV')}
        placeholder={t('000')}
        onChange={(ev) => setExternalId(ev.target.value)}
      />
      <Text mt="6" fontSize="15px">
        {t('(*) campos obrigatórios')}
      </Text>
    </BaseDrawer>
  );
};
