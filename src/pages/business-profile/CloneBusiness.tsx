import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface CloneBusinessProps {
  cloneHandler: () => void;
  isLoading?: boolean;
}

export const CloneBusiness = ({ cloneHandler, isLoading }: CloneBusinessProps) => {
  // state
  const [isCloning, setIsCloning] = React.useState(false);
  // UI
  return (
    <Box>
      <Text mt="8" fontSize="xl" color="black">
        {t('Clonar restaurante')}
      </Text>
      <Text mt="2" fontSize="md">
        {t(
          'Criar um novo restaurante com as informações básicas e o cardápio do restaurante atual.'
        )}
      </Text>
      {isCloning ? (
        <Box mt="4" maxW="640px" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
          <Text>
            {t('Tem certeza que deseja criar um novo restaurante com base no restaurante atual?')}
          </Text>
          <Stack mt="4" spacing={4} direction="row">
            <Button width="full" size="md" variant="danger" onClick={() => setIsCloning(false)}>
              {t('Cancelar')}
            </Button>
            <Button
              width="full"
              size="md"
              onClick={cloneHandler}
              isLoading={isLoading}
              loadingText={t('Clonando...')}
            >
              {t('Confirmar')}
            </Button>
          </Stack>
        </Box>
      ) : (
        <Flex mt="4" pb="8" alignItems="center">
          <Button
            w={{ base: '100%', md: 'auto' }}
            mt={{ base: '8', md: '0' }}
            size="lg"
            fontSize="sm"
            variant="outline"
            onClick={() => setIsCloning(true)}
          >
            {t('Criar cópia deste restaurante')}
          </Button>
        </Flex>
      )}
    </Box>
  );
};
