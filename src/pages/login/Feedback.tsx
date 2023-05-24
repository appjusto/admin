import { Box, Center, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import { AlertSuccess } from 'common/components/AlertSuccess';
import React from 'react';
import { MdCheck } from 'react-icons/md';
import { t } from 'utils/i18n';
import { FeedbackType } from './types';

interface FeedbackProps {
  type: FeedbackType;
  isSuccess: boolean;
  isResetSuccess: boolean;
}

export const Feedback = ({
  type,
  isSuccess,
  isResetSuccess,
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
      ) : (
        <Flex mt="8" flexDirection="column" alignItems="center" color="black">
          <Center w="80px" h="80px" bgColor="green.500" borderRadius="full">
            <Icon as={MdCheck} w="42px" h="42px" color="white" />
          </Center>
          <Text mt="4" textAlign="center">
            {t('Link enviado para o seu e-mail!')}
          </Text>
          <Text textAlign="center">
            {t('Continue o acesso clicando no link')}
          </Text>
        </Flex>
      )}
      <Box mt="10">
        <Box
          mb="10"
          borderTop="1px solid"
          borderColor="gray.500"
          mx={{ base: '0', md: '10%' }}
        />
        <Text textAlign="center" textDecor="underline" cursor="pointer">
          {t('Preciso de ajuda')}
        </Text>
      </Box>
    </Flex>
  );
};
