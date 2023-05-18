import { Box, Center, Flex, Spinner, Text } from '@chakra-ui/react';
import { AlertSuccess } from 'common/components/AlertSuccess';
import React from 'react';
import { t } from 'utils/i18n';
import { FeedbackType } from './types';

interface FeedbackProps {
  type: FeedbackType;
  isSuccess: boolean;
  isResetSuccess: boolean;
  onRestart(): void;
}

export const Feedback = ({
  type,
  isSuccess,
  isResetSuccess,
  onRestart,
}: FeedbackProps) => {
  // UI
  if (type === 'reset') {
    return (
      <Flex w="100%" flexDir="column">
        <Text fontSize="xl" color="black" textAlign="center">
          {t('Entrar no painel do restaurante')}
        </Text>
        <Text fontSize="md" textAlign="center" color="gray.700">
          {t('Quase lá!')}
        </Text>
        {!isResetSuccess ? (
          <Center mt="8" color="green.700">
            <Text mr="2">{t('Enviando link de recuperação')}</Text>
            <Spinner size="sm" />
          </Center>
        ) : (
          <AlertSuccess
            title={t('Link enviado!')}
            description={t(
              'Vá até o seu e-mail, clique no link de recuperação e defina uma nova senha. '
            )}
          />
        )}
        <Box mt="8">
          <Text
            textAlign="center"
            textDecor="underline"
            cursor="pointer"
            onClick={onRestart}
          >
            {t('Voltar ao início')}
          </Text>
        </Box>
      </Flex>
    );
  }
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
          title={t('Link enviado!')}
          description={t('O link de acesso foi enviado para seu e-mail.')}
        />
      ) : (
        <AlertSuccess
          title={t('Link enviado!')}
          description={t(
            'Vá até o seu e-mail e clique no link de acesso para iniciar o seu cadastro. '
          )}
        />
      )}
      <Box mt="8">
        <Text
          textAlign="center"
          textDecor="underline"
          cursor="pointer"
          // onClick={onRestart}
        >
          {t('Preciso de ajuda')}
        </Text>
        <Text
          mt="6"
          textAlign="center"
          textDecor="underline"
          cursor="pointer"
          onClick={onRestart}
        >
          {t('Voltar ao início')}
        </Text>
      </Box>
    </Flex>
  );
};
