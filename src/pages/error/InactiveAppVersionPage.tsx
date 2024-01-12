import {
  Box,
  Button,
  Center,
  Code,
  Collapse,
  Container,
  Flex,
  Icon,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import packageInfo from '../../../package.json';
import { isAppVersionAllowed } from '../../utils/version';

const version = packageInfo.version;

const InactiveAppVersionPage = () => {
  // context
  const { minVersion } = useContextFirebaseUser();
  const { isBackofficeUser } = useContextStaffProfile();
  const { isOpen, onToggle } = useDisclosure();
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
        <Text
          mt="8"
          fontSize="18px"
          lineHeight="22px"
          fontWeight="700"
          textAlign="center"
        >
          {t('Sua versão do appjusto admin está desatualizada')}
        </Text>
        <Text
          mt="4"
          fontSize="15px"
          lineHeight="21px"
          fontWeight="500"
          textAlign="center"
        >
          {t(
            `A sua versão atual (v${version}) é inferior à versão mínima necessária para utilizar a plataforma (v${minVersion}). Clique no botão abaixo para atualizá-la:`
          )}
        </Text>
        <Center>
          <Button mt="6" onClick={handleHardReload}>
            {t('Recarregar para atualizar')}
          </Button>
        </Center>
        <Center>
          <Box w="128px" borderBottom="1px solid #505A4F">
            <Text
              mt="6"
              fontSize="15px"
              lineHeight="21px"
              fontWeight="500"
              textAlign="center"
              cursor="pointer"
              onClick={onToggle}
              mb="-0.5"
            >
              {isOpen ? t('Ver menos') : t('Ver mais opções')}
              <Icon ml="1" mb="-1" as={isOpen ? FaAngleUp : FaAngleDown} />
            </Text>
          </Box>
        </Center>
        <Collapse in={isOpen} animateOpacity>
          <Flex flexDir="column" alignItems="center">
            <Text mt="4" fontWeight="700">
              {t('Opção 1:')}
            </Text>
            <Code mt="2" w="170px">
              Ctrl + F5
            </Code>
            <Text mt="4" fontWeight="700">
              {t('Opção 2:')}
            </Text>
            <Code mt="2" w="170px">
              Ctrl + Shift + R
            </Code>
            <Text mt="4" fontWeight="700">
              {t('ou:')}
            </Text>
            <Code mt="2" w="170px">
              Command + Shift + R
            </Code>
          </Flex>
        </Collapse>
        <Text
          mt="8"
          fontSize="15px"
          lineHeight="21px"
          fontWeight="500"
          textAlign="center"
        >
          {t(
            'Se o problema persistir, você pode entrar em contato com o nosso suporte pelos canais abaixo:'
          )}
        </Text>
        <Text
          mt="6"
          fontSize="15px"
          lineHeight="21px"
          fontWeight="700"
          textAlign="center"
        >
          {t('e-mail: ')}
          <Link
            color="blue.500"
            textDecor="underline"
            href="mailto:contato@appjusto.com.br"
          >
            contato@appjusto.com.br
          </Link>
        </Text>
        <Text
          mt="4"
          fontSize="15px"
          lineHeight="21px"
          fontWeight="700"
          textAlign="center"
        >
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

export default InactiveAppVersionPage;
