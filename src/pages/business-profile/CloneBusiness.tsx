import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { t } from 'utils/i18n';

type Creation = {
  status: boolean;
  type?: 'new' | 'clone';
};

export const CloneBusiness = () => {
  // context
  const history = useHistory();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, setBusinessId } = useContextBusiness();
  const { cloneBusiness, cloneResult } = useBusinessProfile(business?.id);
  // state
  const [isCreating, setIsCreating] = React.useState<Creation>({
    status: false,
  });
  // handlers
  const cloneHandler = async () => {
    if (!isCreating.type) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'CloneBusiness-error',
        message: { title: 'Parâmetros inválidos.' },
      });
      return;
    }
    const isFromScratch = isCreating.type === 'new';
    const newBusiness = await cloneBusiness(isFromScratch);
    if (newBusiness?.id) {
      setBusinessId(newBusiness.id);
      history.push('/app');
    }
  };
  // UI
  return (
    <Box mt="16">
      <Box p="8" bgColor="#F6F6F6" border="1px solid #697667" borderRadius="lg">
        <Text fontSize="xl" color="black">
          {t('Criar um novo restaurante')}
        </Text>
        <Text mt="2" fontSize="md">
          {t(
            'Aqui você pode criar um novo restaurante com as informações básicas e o cardápio do restaurante atual, ou criar um novo restaurante do zero.'
          )}
        </Text>
        {isCreating.status ? (
          <Box
            mt="4"
            bg="#FFF8F8"
            border="1px solid red"
            borderRadius="lg"
            p="6"
          >
            <Text>
              {isCreating.type === 'clone'
                ? t(
                    'Tem certeza que deseja criar um novo restaurante com as informações básicas e o cardápio do restaurante atual?'
                  )
                : t(
                    'Tem certeza que deseja criar um novo restaurante do zero?'
                  )}
            </Text>
            <Stack mt="4" spacing={4} direction={{ base: 'column', md: 'row' }}>
              <Button
                width="full"
                size="md"
                variant="danger"
                onClick={() => setIsCreating({ status: false })}
              >
                {t('Cancelar')}
              </Button>
              <Button
                width="full"
                size="md"
                onClick={cloneHandler}
                isLoading={cloneResult.isLoading}
                loadingText={
                  isCreating.type === 'clone'
                    ? t('Clonando...')
                    : t('Criando...')
                }
              >
                {t('Confirmar')}
              </Button>
            </Stack>
          </Box>
        ) : (
          <Flex mt="4" justifyContent="space-between" alignItems="center">
            <Button
              w={{ base: '100%', md: 'auto' }}
              mt={{ base: '8', md: '0' }}
              size="lg"
              fontSize="sm"
              variant="outline"
              onClick={() => setIsCreating({ status: true, type: 'clone' })}
            >
              {t('Criar cópia do restaurante atual')}
            </Button>
            <Button
              w={{ base: '100%', md: 'auto' }}
              mt={{ base: '8', md: '0' }}
              size="lg"
              fontSize="sm"
              variant="outline"
              onClick={() => setIsCreating({ status: true, type: 'new' })}
            >
              {t('Criar novo restaurante do zero')}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
