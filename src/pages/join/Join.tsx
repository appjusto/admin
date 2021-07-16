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
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { Input } from 'common/components/form/input/Input';
import { Loading } from 'common/components/Loading';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const Join = () => {
  // context
  const api = useContextApi()!;
  const { signInWithEmailLink, signInResult } = useAuthentication();
  const { isLoading, isSuccess, isError, error } = signInResult;
  const link = window.location.href;
  const savedEmail = api.auth().getSignInEmail();
  const isLinkValid = api.auth().isSignInWithEmailLink(link);
  const isEmailSaved = Boolean(savedEmail);
  const { isBackofficeUser } = useContextFirebaseUser();

  // state
  const [email, setEmail] = React.useState('');

  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  React.useEffect(() => {
    if (isLinkValid && isEmailSaved) signInWithEmailLink({ email: savedEmail!, link });
  }, [isLinkValid, isEmailSaved, signInWithEmailLink, savedEmail, link]);

  // UI
  if (!isLinkValid) return <Redirect to="/login" />;

  if (isSuccess && isBackofficeUser !== null) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else return <Redirect to="/app" />;
  }

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
          <Button
            width="full"
            mt="6"
            onClick={() => signInWithEmailLink({ email, link })}
            isLoading={isLoading}
          >
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
  return <Loading />;
};

export default Join;
