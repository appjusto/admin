import { Center, Container, Flex, Link, Text } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { t } from 'utils/i18n';

export const UserNotFound = () => {
  return (
    <Center height="100vh">
      <Container mt="4">
        <Flex w="100%" justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <Text mt="8" fontSize="18px" lineHeight="22px" fontWeight="700" textAlign="center">
          {t('Ocorreu um erro de autenticação =/')}
        </Text>
        <Text mt="4" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t(
            'Não foi possível acessar as credenciais do seu usuário, recarregue esta página, para tentar novamente, ou entre em contato com o nosso suporte pelos canais abaixo:'
          )}
        </Text>
        <Text mt="6" fontSize="15px" lineHeight="21px" fontWeight="700" textAlign="center">
          {t('e-mail: ')}
          <Link color="blue.500" textDecor="underline" href="mailto:contato@appjusto.com.br">
            contato@appjusto.com.br
          </Link>
        </Text>
        <Text mt="4" fontSize="15px" lineHeight="21px" fontWeight="700" textAlign="center">
          {t('Whatsapp: ')}
          <Link
            color="blue.500"
            textDecor="underline"
            href="https://wa.me/+5511978210274?text=Olá, preciso de ajuda para acessar o admin do meu restaurante!"
            isExternal
          >
            +55 11 97821-0274
          </Link>
        </Text>
      </Container>
    </Center>
  );
};
