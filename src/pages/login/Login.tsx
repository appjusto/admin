import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Text,
} from '@chakra-ui/react';
import { useContextApi } from 'app/state/api/context';
import { Input } from 'common/components/form/input/Input';
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
    emailRef?.current?.focus();
  }, []);

  // handlers
  const loginHandler = () => {
    loginWithEmail(email);
  };

  // UI
  return (
    <Flex w="100wh" h="100vh" justifyContent={{ sm: 'center' }}>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'revert' }}>
        <Image src={leftImage} w="100%" h="100vh" />
      </Box>
      <Center w={{ base: '100%', md: '80%', lg: 1 / 3 }}>
        <Box width="full" p={{ base: '8', md: '16' }}>
          <Flex w="100%" justifyContent="center">
            <Image src={logo} />
          </Flex>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              loginHandler();
            }}
          >
            <Box mt="8">
              <Text fontSize="xl" textAlign="center">
                {t('Portal do Parceiro')}
              </Text>
              <Text fontSize="md" textAlign="center" color="gray.500">
                {t('Gerencie seu estabelecimento')}
              </Text>
              <Box mt="4">
                <FormControl isRequired>
                  <Input
                    ref={emailRef}
                    type="email"
                    id="email"
                    label={t('E-mail')}
                    placeholder={t('Endereço de e-mail')}
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                  />
                </FormControl>
                <Box>
                  {isError && (
                    <Alert status="error" mt="6">
                      <AlertIcon />
                      <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                      <AlertDescription>
                        {getErrorMessage(error) ?? t('Tenta de novo?')}
                      </AlertDescription>
                    </Alert>
                  )}
                  {isSuccess && (
                    <Alert status="success" mt="6">
                      <AlertIcon />
                      <AlertDescription>
                        {t('Pronto! O link de acesso foi enviado para seu e-mail.')}
                      </AlertDescription>
                    </Alert>
                  )}
                </Box>
              </Box>
              <Button width="full" h="60px" mt="6" onClick={loginHandler} isLoading={isLoading}>
                {t('Entrar')}
              </Button>
            </Box>
          </form>
        </Box>
      </Center>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'revert' }}>
        <Image src={rightImage} w="100%" h="100vh" />
      </Box>
    </Flex>
  );
};

export default Login;
