import { useCategory } from 'app/api/business/categories/useCategory';
import * as menu from 'app/api/business/menu/functions';
import { useContextMenu } from 'app/state/menu/context';
import { CustomInput as Input } from 'common/components/form/input/CustomInput';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  categoryId: string;
};

export const CategoryDrawer = (props: Props) => {
  const { categoryId } = useParams<Params>();

  // state
  const { menuConfig, updateMenuConfig } = useContextMenu();
  const { category, id, saveCategory, deleteCategory, result } = useCategory(categoryId);
  const { isLoading, isError, error } = result;
  const [name, setName] = React.useState(category?.name ?? '');
  // const [enabled, setEnabled] = React.useState(category?.enabled ?? true);

  // side effects
  React.useEffect(() => {
    if (category) {
      setName(category.name);
      // setEnabled(category.enabled ?? true);
    }
  }, [category]);

  // handlers
  const onSaveHandler = () => {
    (async () => {
      await saveCategory({
        name,
        enabled: true,
      });
      updateMenuConfig(menu.addCategory(menuConfig, id));
      props.onClose();
    })();
  };
  const onDeleteHandler = () => {
    (async () => {
      const categoryProducts = menuConfig.productsOrderByCategoryId[id];
      updateMenuConfig(menu.removeCategory(menuConfig, categoryId));
      await deleteCategory(categoryProducts);
      props.onClose();
    })();
  };

  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);

  // UI
  return (
    <BaseDrawer
      {...props}
      title={category ? t('Editar categoria') : t('Adicionar categoria')}
      initialFocusRef={inputRef}
      type="category"
      isLoading={isLoading}
      isEditing={category ? true : false}
      onSave={onSaveHandler}
      onDelete={onDeleteHandler}
      isError={isError}
      error={error}
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
    </BaseDrawer>
  );
};
