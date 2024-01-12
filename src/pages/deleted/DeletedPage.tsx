import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import Image from 'common/components/Image';
import iconErase from 'common/img/icon-erase-rest.png';
import leftImage from 'common/img/login-left@2x.jpg';
import rightImage from 'common/img/login-right@2x.jpg';
import logo from 'common/img/logo.svg';
import React from 'react';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { t } from 'utils/i18n';

const DeletedPage = () => {
  // context
  const history = useHistory();
  const { businessUnits, changeBusinessId } = useContextBusiness();
  // helpers
  const businessesIsEmpty = businessUnits?.length === 0;
  // handlers
  const handleRedirect = (path: '/onboarding' | '/app') => {
    if (path === '/app') {
      const newId = businessUnits![0].id;
      changeBusinessId(newId);
    } else if (path === '/onboarding') changeBusinessId(null);
    return history.push(path);
  };
  // UI
  return (
    <Flex w="100wh" h="100vh" justifyContent="center">
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={leftImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '80%', lg: 1 / 3 }}
        px={{ base: '8' }}
      >
        <Flex
          maxW="352px"
          h="100%"
          maxH="702px"
          flexDir="column"
          justifyContent="space-between"
          alignItems="center"
          py={{ base: '8' }}
        >
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Image src={iconErase} w="114px" h="114px" />
          </Flex>
          <Box mt="4">
            <Text
              fontSize="20px"
              lineHeight="26px"
              fontWeight="500"
              textAlign="center"
              color="black"
            >
              {t('O seu restaurante foi excluido')}
            </Text>
            <Text
              mt="4"
              fontSize="16px"
              lineHeight="22px"
              fontWeight="500"
              textAlign="center"
            >
              {t(
                'Lamentamos que você tenha excluido o seu restaurante do appjusto. Nosso objetivo é ser uma alternativa de delivery mais justa para todos.'
              )}{' '}
              {businessesIsEmpty && (
                <Text as="span">
                  {t(
                    'Desejamos sorte e esperamos que junte-se a nós em breve!'
                  )}
                </Text>
              )}
            </Text>
            <Box mt="6">
              {businessesIsEmpty ? (
                <Button
                  w="100%"
                  h="60px"
                  onClick={() => handleRedirect('/onboarding')}
                >
                  {t('Criar um novo restaurante')}
                </Button>
              ) : (
                <Button
                  w="100%"
                  h="60px"
                  onClick={() => handleRedirect('/app')}
                >
                  {t('Gerenciar seu outro restaurante')}
                </Button>
              )}
            </Box>
          </Box>
          <Box mt="8" textAlign="center">
            <Flex mb="4" w="100%" justifyContent="center" alignItems="center">
              <Image src={logo} w="96px" />
            </Flex>
            <Link as={RouterLink} to="/logout" textDecor="underline">
              {t('Ir para a página inicial do appjusto')}
            </Link>
          </Box>
          <Box mt="6">
            <Text
              fontSize="16px"
              lineHeight="22px"
              fontWeight="700"
              textAlign="center"
              color="#4EA031"
            >
              {t('Vamos manter contato')}
            </Text>
            <Text
              mt="4"
              fontSize="16px"
              lineHeight="22px"
              fontWeight="500"
              textAlign="center"
            >
              {t('Para falar com o appjusto, mande um e-mail para')}{' '}
              <Link
                fontWeight="700"
                textDecor="underline"
                href="mailto:contato@appjusto.com.br"
              >
                contato@appjusto.com.br
              </Link>{' '}
              {t('ou fale direto conosco no WhatsApp em')}{' '}
              <Link
                fontWeight="700"
                textDecor="underline"
                href="https://wa.me/+5511978210274?text=Olá, preciso de ajuda para acessar o admin do meu restaurante!"
                isExternal
              >
                +55 11 97821-0274
              </Link>
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={rightImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
    </Flex>
  );
};

export default DeletedPage;
