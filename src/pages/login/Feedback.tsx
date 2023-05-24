import { Box, Center, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import { t } from 'utils/i18n';
import { FeedbackType } from './types';

interface FeedbackProps {
  type: FeedbackType;
  isSuccess: boolean;
  isError?: boolean;
  isResetSuccess: boolean;
  isResetError?: boolean;
}

export const Feedback = ({
  type,
  isSuccess,
  isError,
  isResetSuccess,
  isResetError,
}: FeedbackProps) => {
  // helpers
  const isSendingResetLink = !isResetSuccess && !isResetError;
  const isSendingLink = !isSuccess && !isError;
  // UI
  if (type === 'reset') {
    return (
      <Flex w="100%" flexDir="column">
        <Text fontSize="xl" color="black" textAlign="center">
          {t('Entrar no painel do restaurante')}
        </Text>
        <Text fontSize="md" textAlign="center" color="gray.700">
          {!isResetError ? t('Quase lá!') : t('Será preciso recomeçar =/')}
        </Text>
        {}
        {isSendingResetLink ? (
          <Center mt="8" color="green.700">
            <Text mr="2">{t('Enviando link de recuperação')}</Text>
            <Spinner size="sm" />
          </Center>
        ) : isResetSuccess ? (
          <Flex mt="8" flexDirection="column" alignItems="center" color="black">
            <Center w="80px" h="80px" bgColor="green.500" borderRadius="full">
              <Icon as={MdCheck} w="42px" h="42px" color="white" />
            </Center>
            <Text mt="4" textAlign="center">
              {t('Link enviado para o seu e-mail!')}
            </Text>
            <Text textAlign="center">
              {t('Clique no link para redefinir sua senha')}
            </Text>
          </Flex>
        ) : (
          <Flex mt="8" flexDirection="column" alignItems="center" color="black">
            <Center w="80px" h="80px" bgColor="gray.50" borderRadius="full">
              <Icon as={MdClose} w="32px" h="32px" color="gray.600" />
            </Center>
            <Text mt="4" textAlign="center">
              {t('Não foi possível enviar o link para o e-mail informado')}
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
  }
  return (
    <Flex w="100%" flexDir="column">
      <Text fontSize="xl" color="black" textAlign="center">
        {t('Entrar no painel do restaurante')}
      </Text>
      <Text fontSize="md" textAlign="center" color="gray.700">
        {!isError ? t('Quase lá!') : t('Será preciso recomeçar =/')}
      </Text>
      {isSendingLink ? (
        <Center mt="8" color="green.700">
          <Text mr="2">{t('Enviando link de acesso')}</Text>
          <Spinner size="sm" />
        </Center>
      ) : isSuccess ? (
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
      ) : (
        <Flex mt="8" flexDirection="column" alignItems="center" color="black">
          <Center w="80px" h="80px" bgColor="gray.50" borderRadius="full">
            <Icon as={MdClose} w="32px" h="32px" color="gray.600" />
          </Center>
          <Text mt="4" textAlign="center">
            {t('Não foi possível enviar o link para o e-mail informado')}
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
