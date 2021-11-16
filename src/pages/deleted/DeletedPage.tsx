import { Button, Center, Container, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React from 'react';
import { useHistory } from 'react-router';
import { t } from 'utils/i18n';

const DeletedPage = () => {
  // context
  const history = useHistory();
  const { businessesIsEmpty, setBusinessIdByBusinesses, setIsDeleted } = useContextBusiness();
  // handlers
  const handleRedirect = (path: '/onboarding' | '/app') => {
    setIsDeleted(false);
    if (path === '/app') setBusinessIdByBusinesses();
    return history.push(path);
  };
  // UI
  return (
    <Center height="100vh">
      <Container mt="4" maxW="800px">
        <Flex w="100%" justifyContent="center" alignItems="center">
          <Logo />
        </Flex>
        <Text mt="8" fontSize="18px" lineHeight="22px" fontWeight="700" textAlign="center">
          {t('O seu restaurante foi deletado =/')}
        </Text>
        <Text mt="8" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t(
            'Lamentamos que você tenha optado por deletar o seu restaurante. Estamos nos esforçando para oferecer uma alternativa às plataformas atuais de delivery, que seja realmente boa para todos!'
          )}
        </Text>
        {businessesIsEmpty && (
          <Text mt="4" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
            {t(
              'Desejamos sorte e estamos na torcida para que você se junte a nós, nesse movimento, em breve!'
            )}
          </Text>
        )}
        <Text mt="4" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t('O que deseja fazer a seguir?')}
        </Text>
        {businessesIsEmpty ? (
          <Stack
            mt="8"
            w="100%"
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justifyContent="center"
          >
            <Button w={{ base: '100%', md: '260px' }} onClick={() => handleRedirect('/onboarding')}>
              {t('Criar um novo restaurante')}
            </Button>
            <CustomButton
              mt="0"
              w={{ base: '100%', md: '260px' }}
              label={t('Sair da plataforma')}
              link="/logout"
              variant="dangerLight"
            />
          </Stack>
        ) : (
          <Stack
            mt="8"
            w="100%"
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justifyContent="center"
          >
            <Button w={{ base: '100%', md: '260px' }} onClick={() => handleRedirect('/app')}>
              {t('Ir para a página incial')}
            </Button>
            <CustomButton
              mt="0"
              w={{ base: '100%', md: '260px' }}
              label={t('Sair da plataforma')}
              link="/logout"
              variant="dangerLight"
            />
          </Stack>
        )}
        <Text mt="8" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t('Fique a vontade para enviar dúvidas ou reclamações.')}
        </Text>
        <Text fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
          {t('Movimentos como este são construídos com a participação de todos!')}
        </Text>
        <Text mt="2" fontSize="15px" lineHeight="21px" fontWeight="700" textAlign="center">
          {t('e-mail: ')}
          <Link color="blue.500" textDecor="underline" href="mailto:contato@appjusto.com.br">
            contato@appjusto.com.br
          </Link>
        </Text>
        <Text mt="2" fontSize="15px" lineHeight="21px" fontWeight="700" textAlign="center">
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

export default DeletedPage;
