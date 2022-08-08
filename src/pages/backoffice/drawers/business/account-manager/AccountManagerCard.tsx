import { Box, Button, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useFetchStaffProfile } from 'app/api/staff/useFetchStaffProfile';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

interface AccountManagerCardProps {
  accountManagerId: string;
}

export const AccountManagerCard = ({
  accountManagerId,
}: AccountManagerCardProps) => {
  // context
  const profile = useFetchStaffProfile(accountManagerId);
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  // state
  const [isConfirming, setIsConfirming] = React.useState(false);
  // handlers
  const handleRemoveAccountManager = () => {
    return updateBusinessProfile({
      accountManagerId: null,
    });
  };
  // UI
  if (!profile) {
    return (
      <Text mt="4">{t('Não foi possível encontrar o gerente da conta')}</Text>
    );
  }
  return (
    <Flex
      mt="4"
      p="6"
      border="1px solid #E5E5E5"
      borderRadius="lg"
      flexDir={{
        base: 'column',
        md: 'row',
      }}
      justifyContent="space-between"
      alignItems="center"
      fontSize="15px"
    >
      <Box>
        <Text fontWeight="700">
          {t('Id: ')}
          <Text as="span" fontWeight="500">
            {profile.id}
          </Text>
        </Text>
        <Text fontWeight="700">
          {t('E-mail: ')}
          <Link
            as={RouterLink}
            to={`/backoffice/staff/${profile.id}`}
            fontWeight="500"
            textDecor="underline"
          >
            {profile.email}
          </Link>
        </Text>
        <Text fontWeight="700">
          {t('Nome: ')}
          <Text as="span" fontWeight="500">
            {profile.name ?? 'N/E'}
          </Text>
        </Text>
      </Box>
      {isConfirming ? (
        <Box
          p="4"
          w={{
            base: '100%',
            md: '280px',
          }}
          bgColor="#FFF8F8"
          border="1px solid red"
          borderRadius="lg"
        >
          <Text fontSize="15px" fontWeight="700">
            {t('Deseja confirmar remoção?')}
          </Text>
          <HStack mt="2">
            <Button w="100%" size="sm" onClick={() => setIsConfirming(false)}>
              {t('Manter')}
            </Button>
            <Button
              w="100%"
              size="sm"
              variant="danger"
              onClick={handleRemoveAccountManager}
              isLoading={updateResult.isLoading}
              loadingText={t('Removendo...')}
            >
              {t('Remover')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <Button
          variant="dangerLight"
          size="sm"
          onClick={() => setIsConfirming(true)}
        >
          {t('Remover gerente')}
        </Button>
      )}
    </Flex>
  );
};
