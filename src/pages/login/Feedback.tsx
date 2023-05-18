import { Box, Center, Flex, Spinner, Text } from '@chakra-ui/react';
import { AlertSuccess } from 'common/components/AlertSuccess';
import React from 'react';
import { t } from 'utils/i18n';
import { FeedbackType } from './types';

interface FeedbackProps {
  type: FeedbackType;
  isSuccess: boolean;
  onRestart(): void;
}

export const Feedback = ({ type, isSuccess, onRestart }: FeedbackProps) => {
  // UI
  return (
    <Flex w="100%" flexDir="column">
      <Text fontSize="xl" color="black" textAlign="center">
        {t('Entrar no painel do restaurante')}
      </Text>
      <Text fontSize="md" textAlign="center" color="gray.700">
        {t('Quase lá!')}
      </Text>
      {!isSuccess ? (
        <Center mt="8" color="green.700">
          <Text mr="2">{t('Enviando link de acesso')}</Text>
          <Spinner size="sm" />
        </Center>
      ) : type === 'login' ? (
        <AlertSuccess
          title={t('Pronto!')}
          description={t('O link de acesso foi enviado para seu e-mail.')}
        />
      ) : (
        <AlertSuccess
          title={t('Pronto!')}
          description={t(
            'Vá até o seu e-mail e clique no link de acesso para iniciar o seu cadastro. '
          )}
        />
      )}
      <Box mt="8" color="green.700">
        <Text
          textAlign="center"
          textDecor="underline"
          cursor="pointer"
          onClick={onRestart}
        >
          {t('Voltar ao início')}
        </Text>
        <Text
          mt="6"
          textAlign="center"
          textDecor="underline"
          cursor="pointer"
          // onClick={onRestart}
        >
          {t('Preciso de ajuda')}
        </Text>
      </Box>
    </Flex>
  );
};
