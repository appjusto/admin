import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';
import { useApi } from 'app/api/context';
import { getErrorMessage } from 'app/api/utils';
import { useBusinessId } from 'app/state/business/context';
import { Product } from 'appjusto-types';
import { Input } from 'common/components/Input';
import React from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { BaseDrawer } from './BaseDrawer';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  categoryId: string;
  productId: string;
};

export const ProductDrawer = (props: Props) => {
  // context
  const api = useApi()!;
  const businessId = useBusinessId()!;
  // const { categoryId, productId } = useParams<Params>();
  const { categoryId } = useParams<Params>();
  // const isNew = productId === 'new';

  // state
  const [name, setName] = React.useState('');
  const [addProduct, { isLoading, isError, error }] = useMutation(async (product: Product) => {
    await api.menu().addProduct(businessId, product, categoryId);
  });

  // handlers
  const onSaveHandler = () => {
    (async () => {
      await addProduct({
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
      title={t('Adicionar produto')}
      initialFocusRef={inputRef}
      onSave={onSaveHandler}
      isLoading={isLoading}
    >
      <Input
        ref={inputRef}
        value={name}
        label={t('Novo produto')}
        placeholder={t('Nome do produto')}
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
