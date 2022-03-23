import * as menu from '@appjusto/menu';
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
  const { category, id, saveCategory, deleteCategory, result, deleteCategoryResult } =
    useCategory(categoryId);
  const { isLoading, isError, error } = result;
  const [name, setName] = React.useState(category?.name ?? '');
  // const [enabled, setEnabled] = React.useState(category?.enabled ?? true);
  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const onSaveHandler = async () => {
    await saveCategory({
      name,
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
      // setEnabled(category.enabled ?? true);
    }
  }, [category]);
  // UI
  return (
    <BaseDrawer
      {...props}
      title={category ? t('Editar categoria') : t('Adicionar categoria')}
      type="category"
      isError={isError}
      error={error}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSaveHandler();
        }}
      >
        <Input
          isRequired
          id="category-drawer-name"
          ref={inputRef}
          value={name}
          label={t('Nova categoria')}
          placeholder={t('Nome da categoria')}
          onChange={(ev) => setName(ev.target.value)}
        />
        <DrawerButtons
          type="categoria"
          isEditing={categoryId !== 'new'}
          onDelete={onDeleteHandler}
          isLoading={isLoading}
          deletingLoading={deleteCategoryResult.isLoading}
        />
      </form>
    </BaseDrawer>
  );
};
