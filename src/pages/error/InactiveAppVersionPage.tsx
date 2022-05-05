import { Button, Center, Code, Container, Flex, Link, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import packageInfo from '../../../package.json';
import { isAppVersionAllowed } from '../../utils/version';

const version = packageInfo.version;

export const InactiveAppVersionPage = () => {
  // context
  const { minVersion, isBackofficeUser } = useContextFirebaseUser();
  // handlers
  const handleHardReload = () => {
    if (caches) {
      console.log('Clearing old cache...');
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
    console.log('Reloading Admin...');
    // delete browser cache and hard reload
    window.location.reload();
  };
  //UI
  if (minVersion && isAppVersionAllowed(minVersion, version)) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else return <Redirect to="/app" />;
  }
  return (
    <Center height="100vh">
      <Container mt="4">
        <Flex w="100%" justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <Text mt="8" fontSize="18px" lineHeight="22px" fontWeight="700" textAlign="center">
          {t('Sua versão do AppJusto Admin está desatualizada')}
        </Text>
        <Text mt="4" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t(
            `A sua versão atual (v${version}) é inferior à versão mínima necessária para utilizar a plataforma (v${minVersion}). Clique no botão abaixo para recarregar a página, ou pressione as teclas:`
          )}
        </Text>
        <Flex flexDir="column" alignItems="center">
          <Text mt="4" fontWeight="700">
            {t('Se estiver no windows:')}
          </Text>
          <Code mt="2" w="160px">
            Ctrl + F5
          </Code>
          <Text mt="4" fontWeight="700">
            {t('Se estiver no Mac ou Linux:')}
          </Text>
          <Code mt="2" w="160px">
            Ctrl + Shift + R
          </Code>
        </Flex>
        <Center>
          <Button mt="6" onClick={handleHardReload}>
            {t('Recarregar para atualizar')}
          </Button>
        </Center>
        <Text mt="8" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t(
            'Se o problema persistir, você pode entrar em contato com o nosso suporte pelos canais abaixo:'
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
