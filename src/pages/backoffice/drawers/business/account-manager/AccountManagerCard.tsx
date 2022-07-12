import { BusinessAccountManager } from '@appjusto/types';
import { Box, Button, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

interface AccountManagerCardProps {
  accountManager: BusinessAccountManager;
}

export const AccountManagerCard = ({ accountManager }: AccountManagerCardProps) => {
  // context
  const { updateBusinessAccountManager, updateAccountManagerResult } = useBusinessProfile();
  // state
  const [isConfirming, setIsConfirming] = React.useState(false);
  // handlers
  const handleRemoveAccountManager = () => {
    const managerData = {
      id: null,
      email: null,
      name: null
    };
    return updateBusinessAccountManager(managerData);
  }
  // UI
  return (
    <Flex 
      mt="4"
      p="6" 
      border="1px solid #E5E5E5"
      borderRadius="lg"
      flexDir={{base: 'column', md: 'row'}} 
      justifyContent="space-between" 
      alignItems="center"
      fontSize="15px"
     >
      <Box>
        <Text fontWeight="700">
          {t('Id: ')}
          <Text as="span" fontWeight="500">{accountManager.id}</Text>
        </Text>
        <Text fontWeight="700">
          {t('E-mail: ')}
          <Link 
            as={RouterLink} 
            to={`/backoffice/staff/${accountManager.id}`}
            fontWeight="500"
            textDecor="underline"
          >
            {accountManager.email}
          </Link>
        </Text>
        <Text fontWeight="700">
          {t('Nome: ')}
          <Text as="span" fontWeight="500">{accountManager.name ?? 'N/E'}</Text>
        </Text>
      </Box>
      {
        isConfirming ? (
          <Box 
            p="4" 
            w={{base: '100%', md: '280px'}} 
            bgColor="#FFF8F8" 
            border="1px solid red" 
            borderRadius="lg"
          >
            <Text fontSize="15px" fontWeight="700">{t('Deseja confirmar remoção?')}</Text>
            <HStack mt="2">
              <Button w="100%" size="sm" onClick={() => setIsConfirming(false)}>
                {t('Manter')}
              </Button>
              <Button
                w="100%"
                size="sm"
                variant="danger"
                onClick={handleRemoveAccountManager}
                isLoading={updateAccountManagerResult.isLoading}
                loadingText={t('Removendo...')}
              >
                {t('Remover')}
              </Button>
            </HStack>
          </Box>
        ) : (
          <Button variant="dangerLight" size="sm" onClick={() => setIsConfirming(true)}>
            {t('Remover gerente')}
          </Button>
        )
      }
    </Flex>
  );
};