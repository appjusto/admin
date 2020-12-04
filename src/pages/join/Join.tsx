import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Container,
  FormControl,
  Text,
} from '@chakra-ui/react';
import { getErrorMessage } from 'app/api/utils';
import { useApi } from 'app/state/api/context';
import { Input } from 'common/components/form/Input';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const Join = () => {
  // context
  const api = useApi()!;
  const link = window.location.href;
  const savedEmail = api.auth().getSignInEmail();
  const isLinkValid = api.auth().isSignInWithEmailLink(link);
  const isEmailSaved = Boolean(savedEmail);

  // state
  const [email, setEmail] = useState('');
  const [signIn, { isLoading, isSuccess, isError, error }] = useMutation(async (email: string) => {
    api.auth().signInWithEmailLink(email, link);
  });

  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);

  // side effects
  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (isLinkValid && isEmailSaved) signIn(savedEmail!);
  }, [isLinkValid, isEmailSaved, signIn, savedEmail]);

  // UI
  if (!isLinkValid) return <Redirect to="/" />;

  if (!isSuccess) return <Redirect to="/home" />;

  if (!isEmailSaved)
    return (
      <Center height="100vh">
        <Container mt="4">
          <Text>{t('Confirme o seu e-mail:')}</Text>
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

          <Button width="full" mt="6" onClick={() => signIn(email)} isLoading={isLoading}>
            {t('Entrar')}
          </Button>

          <Box mt="6">
            {isError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                <AlertDescription>{getErrorMessage(error) ?? t('Tenta de novo?')}</AlertDescription>
              </Alert>
            )}
          </Box>
        </Container>
      </Center>
    );
  return (
    <Center height="100vh">
      <Logo />
    </Center>
  );
};

export default Join;
