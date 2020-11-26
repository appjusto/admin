import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';
import { useCategoryCreate } from 'app/api/menu/categories/useCategoryCreate';
import { getErrorMessage } from 'app/api/utils';
import { Input } from 'common/components/Input';
import React from 'react';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

// type Params = {
//   categoryId: string;
// };

export const CategoryDrawer = (props: Props) => {
  // const { categoryId } = useParams<Params>();
  // const isNew = categoryId === 'new';

  // mutations
  const { createCategory, result } = useCategoryCreate();
  const { isLoading, isError, error } = result;

  // state
  const [name, setName] = React.useState('');

  // handlers
  const onSaveHandler = () => {
    (async () => {
      await createCategory({
        name,
        enabled: true,
      });

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
    </BaseDrawer>
  );
};
