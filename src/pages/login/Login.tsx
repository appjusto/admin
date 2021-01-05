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
import { useApi } from 'app/state/api/context';
import { Input } from 'common/components/form/input/Input';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { getErrorMessage } from 'core/fb';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { t } from 'utils/i18n';
import Image from '../../common/components/Image';
import leftImage from './img/login-left@2x.jpg';
import rightImage from './img/login-right@2x.jpg';

const Login = () => {
  // context
  const api = useApi();

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
        <Image src={leftImage} objectFit="contain" />
      </Box>
      <Center w={{ base: '100%', md: '80%', lg: 1 / 3 }}>
        <Box width="full" p={{ base: '8', md: '16' }}>
          <Logo />
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              loginHandler();
            }}
          >
            <Box mt="8">
              <Text fontSize="xl">{t('Portal do Parceiro')}</Text>
              <Text fontSize="md" color="gray.500">
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
                <Box mt="6">
                  {isError && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                      <AlertDescription>
                        {getErrorMessage(error) ?? t('Tenta de novo?')}
                      </AlertDescription>
                    </Alert>
                  )}
                  {isSuccess && (
                    <Alert status="success">
                      <AlertIcon />
                      <AlertDescription>
                        {t('Pronto! O link de acesso foi enviado para seu e-mail.')}
                      </AlertDescription>
                    </Alert>
                  )}
                </Box>
              </Box>
              <Button width="full" mt="6" onClick={loginHandler} isLoading={isLoading}>
                {t('Entrar')}
              </Button>
            </Box>
          </form>
        </Box>
      </Center>
      <Box w={{ lg: 1 / 3 }} display={{ base: 'none', lg: 'revert' }}>
        <Image src={rightImage} objectFit="contain" />
      </Box>
    </Flex>
  );
};

export default Login;
