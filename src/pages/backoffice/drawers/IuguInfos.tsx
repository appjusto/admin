import { MarketplaceAccountInfo } from '@appjusto/types';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { MutationResult } from 'app/api/mutation/useCustomMutation';
import { AlertError } from 'common/components/AlertError';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { iuguSituationPTOptions } from '../utils';
import { SectionTitle } from './generics/SectionTitle';

interface IuguInfosProps {
  account?: MarketplaceAccountInfo | null;
  deleteAccount(): void;
  result: MutationResult;
}

export const IuguInfos = ({ account, deleteAccount, result }: IuguInfosProps) => {
  // context
  const { isLoading, isSuccess } = result;
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const createdOn = account?.info?.created_at
    ? getDateAndHour(new Date(account?.info?.created_at))
    : 'N/E';
  // handlers
  const handleDeleteAccount = () => {
    return deleteAccount();
  };
  // side effects
  React.useEffect(() => {
    if (isSuccess) setIsDeleting(false);
  }, [isSuccess]);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Subconta')}</SectionTitle>
      {account && !account?.account && (
        <AlertError
          mt="2"
          title={t('Erro na criação da subconta')}
          description={t('O objeto "account" não foi criado.')}
        />
      )}
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('ID:')}{' '}
        <Text as="span" fontWeight="500">
          {account?.info?.id ?? 'N/E'}
        </Text>
      </Text>
      <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
        {t('Criada em:')}{' '}
        <Text as="span" fontWeight="500">
          {createdOn}
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
        <Button
          mt="4"
          size="md"
          variant="dangerLight"
          onClick={() => setIsDeleting(true)}
          isDisabled={!account}
        >
          {t('Deletar subconta')}
        </Button>
      )}
    </Box>
  );
};
