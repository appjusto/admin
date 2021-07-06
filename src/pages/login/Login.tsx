import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { EmailAndPassword } from 'app/api/auth/useCreateAndUpdateFirebaseUsers';
import { useContextApi } from 'app/state/api/context';
import { AlertError } from 'common/components/AlertError';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPasswordInput } from 'common/components/form/input/CustomPasswordInput';
import logo from 'common/img/logo.svg';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { useMutation } from 'react-query';
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
  const api = useContextApi();

  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwdRef = React.useRef<HTMLInputElement>(null);

  // state
  const [email, setEmail] = React.useState('');
  const [passwd, setPasswd] = React.useState('');
  const [isPassword, setIsPassword] = React.useState(false);
  const [isLoading, setIsloading] = React.useState(false);
  const [error, setError] = React.useState<InitialError>(initialError);

  // mutations
  const [loginWithEmail, loginWithLinkResult] = useMutation((email: string) =>
    api.auth().sendSignInLinkToEmail(email)
  );

  const [loginWithPasswd, loginWithPasswdResult] = useMutation((data: EmailAndPassword) =>
    api.auth().signInWithEmailAndPassword(data.email, data.password)
  );

  // handlers
  const loginHandler = () => {
    if (isPassword) return loginWithPasswd({ email, password: passwd });
    else return loginWithEmail(email);
  };

  // side effects
  React.useEffect(() => {
    api.auth().signOut();
    emailRef?.current?.focus();
  }, [api]);

  React.useEffect(() => {
    if (isPassword) setIsloading(loginWithPasswdResult.isLoading);
    else setIsloading(loginWithLinkResult.isLoading);
  }, [isPassword, loginWithLinkResult.isLoading, loginWithPasswdResult.isLoading]);

  React.useEffect(() => {
    if (isPassword)
      setError({ status: loginWithPasswdResult.isError, error: loginWithPasswdResult.error });
    else setError({ status: loginWithLinkResult.isError, error: loginWithLinkResult.error });
  }, [
    isPassword,
    loginWithLinkResult.isError,
    loginWithLinkResult.error,
    loginWithPasswdResult.isError,
    loginWithPasswdResult.error,
  ]);

  React.useEffect(() => {
    if (loginWithLinkResult.isSuccess) setError(initialError);
  }, [loginWithLinkResult.isSuccess]);

  // UI
  if (loginWithPasswdResult.isSuccess) return <Redirect to="/app" />;
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
              title={t('Erro!')}
              description={getErrorMessage(error.error) ?? t('Tenta de novo?')}
            />
          )}
          {loginWithLinkResult.isSuccess && (
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
