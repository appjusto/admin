import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { MarketplaceAccountInfo } from 'appjusto-types';
import { AlertError } from 'common/components/AlertError';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import React from 'react';
import { MutationResult } from 'react-query';
import { t } from 'utils/i18n';
import { iuguSituationPTOptions } from '../utils';
import { SectionTitle } from './generics/SectionTitle';

interface IuguInfosProps {
  account?: MarketplaceAccountInfo | null;
  deleteAccount(): void;
  result: MutationResult<void, unknown>;
}

export const IuguInfos = ({ account, deleteAccount, result }: IuguInfosProps) => {
  // context
  const { isLoading, isSuccess, isError, error: deleteError } = result;
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const handleDeleteAccount = () => {
    submission.current += 1;
    return deleteAccount();
  };
  // side effects
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: deleteError,
      });
    }
  }, [isError, deleteError]);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Subconta')}</SectionTitle>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('ID:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.info?.id ?? 'N/E'}
        </Text>
      </Text>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Criada em:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.info?.created_at ?? 'N/E'}
        </Text>
      </Text>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Verificada:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.situation && iuguSituationPTOptions[account?.situation]}
        </Text>
      </Text>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Saldo:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.account?.balance ?? 'N/E'}
        </Text>
      </Text>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('A liberar:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.account?.balance_available_for_withdraw ?? 'N/E'}
        </Text>
      </Text>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Tipo de conta:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.verification?.data.person_type ?? 'N/E'}
        </Text>
      </Text>
      {isDeleting ? (
        <AlertError title={t('Tem certeza que deseja excluir esta subconta?')}>
          <HStack mt="2">
            <Button mt="0" w="160px" size="md" onClick={() => setIsDeleting(false)}>
              {t('Manter')}
            </Button>
            <Button
              mt="0"
              w="160px"
              size="md"
              variant="danger"
              onClick={handleDeleteAccount}
              isLoading={isLoading}
            >
              {t('Confirmar')}
            </Button>
          </HStack>
        </AlertError>
      ) : (
        <Button mt="4" size="md" variant="dangerLight" onClick={() => setIsDeleting(true)}>
          {t('Deletar subconta')}
        </Button>
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
      />
    </Box>
  );
};
