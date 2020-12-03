import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';
import { useCategory } from 'app/api/business/categories/useCategory';
import { getErrorMessage } from 'app/api/utils';
import { useMenuConfigValue } from 'app/state/menu/config';
import { Input } from 'common/components/form/Input';
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
  const { addCategory } = useMenuConfigValue();
  const { category, id, saveCategory, result } = useCategory(categoryId);
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
      await addCategory(id);
      props.onClose();
    })();
  };

  // refs
  const inputRef = React.useRef<HTMLInputElement>(null);

  // UI
  return (
    <BaseDrawer
      {...props}
      title={t('Adicionar categoria')}
      initialFocusRef={inputRef}
      onSave={onSaveHandler}
      isLoading={isLoading}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSaveHandler();
        }}
      >
        <Input
          ref={inputRef}
          value={name}
          label={t('Nova categoria')}
          placeholder={t('Nome da categoria')}
          onChange={(ev) => setName(ev.target.value)}
        />
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
      </form>
    </BaseDrawer>
  );
};
