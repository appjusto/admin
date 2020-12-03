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
import { getErrorMessage } from 'app/api/utils';
import { useApi } from 'app/state/api/context';
import { Input } from 'common/components/form/Input';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { t } from 'utils/i18n';

const HomeLeftImage = React.lazy(() => import(/* webpackPrefetch: true */ './img/HomeLeftImage'));
const HomeRightImage = React.lazy(() => import(/* webpackPrefetch: true */ './img/HomeRightImage'));

const Home = () => {
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
    <Flex>
      <Box w={[0, 1 / 3]} display={['none', 'revert']}>
        <React.Suspense fallback={null}>
          <HomeLeftImage />
        </React.Suspense>
      </Box>
      <Center w={['100%', 1 / 3]}>
        <Box width="full" p="16">
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
      <Box w={[0, 1 / 3]} display={['none', 'revert']}>
        <React.Suspense fallback={null}>
          <HomeRightImage />
        </React.Suspense>
      </Box>
    </Flex>
  );
};

export default Home;
