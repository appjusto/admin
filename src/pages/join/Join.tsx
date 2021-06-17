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
import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextApi } from 'app/state/api/context';
import { Input } from 'common/components/form/input/Input';
import { Loading } from 'common/components/Loading';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { useMutation } from 'react-query';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const Join = () => {
  // context
  const api = useContextApi()!;
  const link = window.location.href;
  const savedEmail = api.auth().getSignInEmail();
  const isLinkValid = api.auth().isSignInWithEmailLink(link);
  const isEmailSaved = Boolean(savedEmail);
  const { isBackofficeUser } = useContextAgentProfile();

  // state
  const [email, setEmail] = React.useState('');
  const [signIn, { isLoading, isSuccess, isError, error }] = useMutation(async (email: string) => {
    api.auth().signInWithEmailLink(email, link);
  });

  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  React.useEffect(() => {
    if (isLinkValid && isEmailSaved) signIn(savedEmail!);
  }, [isLinkValid, isEmailSaved, signIn, savedEmail]);

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
          <Button width="full" mt="6" onClick={() => signIn(email)} isLoading={isLoading}>
            <Text as="span">{t('Entrar')}</Text>
          </Button>
          <Box mt="6">
            {isError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
              </Alert>
            )}
          </Box>
        </Container>
      </Center>
    );
  return <Loading />;
};

export default Join;
