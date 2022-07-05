import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { isElectron } from '@firebase/util';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextAppRequests } from 'app/state/requests/context';
import { AlertSuccess } from 'common/components/AlertSuccess';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { CustomPasswordInput } from 'common/components/form/input/CustomPasswordInput';
import Image from 'common/components/Image';
import leftImage from 'common/img/login-left@2x.jpg';
import rightImage from 'common/img/login-right@2x.jpg';
import logo from 'common/img/logo.svg';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { isEmailValid, normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';

const isDesktopApp = isElectron();

const Login = () => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { login, loginResult, signOut } = useAuthentication();
  const { isLoading, isSuccess } = loginResult;
  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwdRef = React.useRef<HTMLInputElement>(null);
  // state
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [passwd, setPasswd] = React.useState('');
  const [isPassword, setIsPassword] = React.useState(isDesktopApp);
  const isEmailInvalid = React.useMemo(() => !isEmailValid(email), [email]);
  // handlers
  const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isEmailInvalid) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'handleSubmit-email-invalid',
        message: { title: 'O e-mail informado não é válido. Corrija e tente novamente.' },
      });
    }
    login({ email, password: passwd, isLogin });
  };
  // side effects
  React.useEffect(() => {
    signOut();
    emailRef?.current?.focus();
  }, [signOut]);
  React.useEffect(() => {
    if (!isPassword) {
      setPasswd('');
    }
  }, [isPassword]);
  // UI
  if (isPassword && isSuccess) return <Redirect to="/app" />;
  if (isDesktopApp) {
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
          <Text fontSize="xl" color="black" textAlign="center">
            {t('Entrar no portal do restaurante')}
          </Text>
          <Text fontSize="md" textAlign="center" color="gray.700">
            {t('Gerencie seu estabelecimento')}
          </Text>
          <Flex as="form" w="100%" flexDir="column" onSubmit={handleSubmit}>
            <CustomInput
              ref={emailRef}
              isRequired
              type="email"
              id="login-email"
              label={t('E-mail')}
              placeholder={t('Endereço de e-mail')}
              value={email}
              handleChange={(ev) => setEmail(normalizeEmail(ev.target.value))}
              isInvalid={email !== '' && isEmailInvalid}
            />
            <CustomPasswordInput
              ref={passwdRef}
              isRequired={isPassword}
              id="login-password"
              label={t('Senha')}
              placeholder={t('Senha de acesso')}
              value={passwd}
              handleChange={(ev) => setPasswd(ev.target.value)}
            />
            <Text mt="4" fontSize="sm">
              {t(
                'Esqueceu a senha? Acesse o portal do seu restaurante pela web e redefina sua senha.'
              )}
            </Text>
            <Button type="submit" width="full" h="60px" mt="6" isLoading={isLoading}>
              {t('Entrar')}
            </Button>
          </Flex>
        </Flex>
        <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
          <Image src={rightImage} scrollCheck={false} w="100%" h="100vh" />
        </Box>
      </Flex>
    )
  }
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
        {isLogin ? (
          <>
            <Text fontSize="xl" color="black" textAlign="center">
              {t('Entrar no portal do restaurante')}
            </Text>
            <Text fontSize="md" textAlign="center" color="gray.700">
              {t('Gerencie seu estabelecimento')}
            </Text>
          </>
        ) : (
          <>
            <Text fontSize="xl" color="black" textAlign="center">
              {t('Criar novo cadastro')}
            </Text>
            <Text maxW="360px" fontSize="md" textAlign="center" color="gray.700">
              {t(
                'Você está prestes a ter uma experiência mais justa para seus clientes e entregadores!'
              )}
            </Text>
          </>
        )}
        <Flex as="form" w="100%" flexDir="column" onSubmit={handleSubmit}>
          <CustomInput
            ref={emailRef}
            isRequired
            type="email"
            id="login-email"
            label={t('E-mail')}
            placeholder={t('Endereço de e-mail')}
            value={email}
            handleChange={(ev) => setEmail(normalizeEmail(ev.target.value))}
            isInvalid={email !== '' && isEmailInvalid}
          />
          {isLogin && (
            <>
              <CustomCheckbox
                mt="4"
                aria-label="login-password-checkbox"
                colorScheme="green"
                value="available"
                isChecked={isPassword}
                onChange={(e) => setIsPassword(e.target.checked)}
              >
                {t('Usar senha de acesso')}
              </CustomCheckbox>
              <Text mt="2" fontSize="xs">
                {t('Ao entrar sem senha, enviaremos um link de acesso para o e-mail cadastrado.')}
              </Text>
            </>
          )}
          {isPassword && (
            <>
              <CustomPasswordInput
                ref={passwdRef}
                isRequired={isPassword}
                id="login-password"
                label={t('Senha')}
                placeholder={t('Senha de acesso')}
                value={passwd}
                handleChange={(ev) => setPasswd(ev.target.value)}
              />
              <Text mt="4" fontSize="sm" fontWeight="700">
                {t(
                  'Esqueceu a senha? Então desative essa opção e faça o login somente com o e-mail cadastrado. Você poderá criar uma nova senha na sua página de Perfil.'
                )}
              </Text>
            </>
          )}
          {!isPassword && isSuccess && (
            <AlertSuccess
              title={t('Pronto!')}
              description={t('O link de acesso foi enviado para seu e-mail.')}
            />
          )}
          <Button type="submit" width="full" h="60px" mt="6" isLoading={isLoading}>
            {isLogin ? t('Entrar') : t('Cadastrar')}
          </Button>
          {isLogin ? (
            <Text mt="4" textAlign="center">
              {t('Ainda não possui uma conta? ')}
              <Text
                as="span"
                textDecor="underline"
                cursor="pointer"
                onClick={() => setIsLogin(false)}
              >
                {t('Clique aqui.')}
              </Text>
            </Text>
          ) : (
            <Text
              mt="4"
              textAlign="center"
              textDecor="underline"
              cursor="pointer"
              onClick={() => setIsLogin(true)}
            >
              {t('Já tenho uma conta')}
            </Text>
          )}
        </Flex>
      </Flex>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'block' }}>
        <Image src={rightImage} scrollCheck={false} w="100%" h="100vh" />
      </Box>
    </Flex>
  );
};

export default Login;
