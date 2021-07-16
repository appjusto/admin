import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPasswordInput } from 'common/components/form/input/CustomPasswordInput';
import logo from 'common/img/logo.svg';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import Image from '../../common/components/Image';
import leftImage from './img/login-left@2x.jpg';
import rightImage from './img/login-right@2x.jpg';

interface InitialError {
  status: boolean;
  error: unknown | null;
}

const initialError = { status: false, error: null };

const Login = () => {
  // context
  const { login, loginResult, signOut } = useAuthentication();
  const { isLoading, isSuccess, isError, error: loginError } = loginResult;
  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwdRef = React.useRef<HTMLInputElement>(null);
  // state
  const [email, setEmail] = React.useState('');
  const [passwd, setPasswd] = React.useState('');
  const [isPassword, setIsPassword] = React.useState(false);
  const [error, setError] = React.useState<InitialError>(initialError);
  // side effects
  React.useEffect(() => {
    signOut();
    emailRef?.current?.focus();
  }, [signOut]);
  React.useEffect(() => {
    if (isError)
      setError({
        status: true,
        error: loginError,
      });
  }, [isError, loginError]);
  React.useEffect(() => {
    if (isSuccess) setError(initialError);
  }, [isSuccess]);
  React.useEffect(() => {
    if (!isPassword) {
      setPasswd('');
      setError(initialError);
    }
  }, [isPassword]);
  // UI
  if (isPassword && isSuccess) return <Redirect to="/app" />;
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
            login({ email, password: passwd });
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
          <Checkbox
            mt="4"
            colorScheme="green"
            iconColor="white"
            value="available"
            color="black"
            isChecked={isPassword}
            onChange={(e) => setIsPassword(e.target.checked)}
          >
            {t('Usar senha de acesso')}
          </Checkbox>
          <Text mt="2" fontSize="xs">
            {t('Ao entrar sem senha, enviaremos um link de acesso para o e-mail cadastrado.')}
          </Text>
          {isPassword && (
            <CustomPasswordInput
              ref={passwdRef}
              isRequired={isPassword}
              id="login-password"
              label={t('Senha')}
              placeholder={t('Senha de acesso')}
              value={passwd}
              handleChange={(ev) => setPasswd(ev.target.value)}
            />
          )}
          {error.status && (
            <AlertError
              title={t('A autenticação falhou!')}
              description={getErrorMessage(error.error) ?? t('Tenta de novo?')}
            />
          )}
          {!isPassword && isSuccess && (
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
