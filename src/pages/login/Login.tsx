import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useContextApi } from 'app/state/api/context';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput } from 'common/components/form/input/CustomInput';
import logo from 'common/img/logo.svg';
import { getErrorMessage } from 'core/fb';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { t } from 'utils/i18n';
import Image from '../../common/components/Image';
import leftImage from './img/login-left@2x.jpg';
import rightImage from './img/login-right@2x.jpg';

const Login = () => {
  // context
  const api = useContextApi();

  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);

  // state
  const [email, setEmail] = useState('');

  // mutations
  const [loginWithEmail, { isLoading, isSuccess, isError, error }] = useMutation((email: string) =>
    api.auth().sendSignInLinkToEmail(email)
  );

  // side effects
  useEffect(() => {
    api.auth().signOut();
    emailRef?.current?.focus();
  }, [api]);

  // handlers
  const loginHandler = () => {
    loginWithEmail(email);
  };
  // UI
  return (
    <Flex w="100wh" h="100vh" justifyContent={{ sm: 'center' }}>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={leftImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w={{ base: '100%', md: '80%', lg: 1 / 3 }}
        px={{ base: '8', md: '24', lg: '8' }}
      >
        <Image src={logo} scrollCheck={false} mb="8" />
        <Text fontSize="xl" textAlign="center">
          {t('Portal do Restaurante')}
        </Text>
        <Text fontSize="md" textAlign="center" color="gray.500">
          {t('Gerencie seu estabelecimento')}
        </Text>
        <Flex
          as="form"
          w="100%"
          flexDir="column"
          onSubmit={(ev) => {
            ev.preventDefault();
            loginHandler();
          }}
        >
          <CustomInput
            ref={emailRef}
            isRequired
            type="email"
            id="login-email"
            label={t('E-mail')}
            placeholder={t('Endereço de e-mail')}
            value={email}
            handleChange={(ev) => setEmail(ev.target.value)}
          />
          {isError && (
            <AlertError
              title={t('Erro!')}
              description={getErrorMessage(error) ?? t('Tenta de novo?')}
            />
          )}
          {isSuccess && (
            <AlertSuccess
              title={t('Pronto!')}
              description={t('O link de acesso foi enviado para seu e-mail.')}
            />
          )}
          <Button type="submit" width="full" h="60px" mt="6" isLoading={isLoading}>
            {t('Entrar')}
          </Button>
        </Flex>
      </Flex>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={rightImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
    </Flex>
  );
};

export default Login;
