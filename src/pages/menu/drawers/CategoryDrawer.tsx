import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';
import { useApi } from 'app/api/context';
import { getErrorMessage } from 'app/api/utils';
import { Category } from 'appjusto-types';
import { Input } from 'common/components/Input';
import React from 'react';
import { useMutation } from 'react-query';
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
  // context
  const api = useApi()!;
  // const { categoryId } = useParams<Params>();
  // const isNew = categoryId === 'new';

  // state
  const [name, setName] = React.useState('');
  const [addCategory, { isLoading, isError, error }] = useMutation(async (category: Category) => {
    api.menu().addCategory('default', category);
  });

  // handlers
  const onSaveHandler = () => {
    (async () => {
      await addCategory({
        name,
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
