import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  Text,
} from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextApi } from 'app/state/api/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { Loading } from 'common/components/Loading';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { getFirebaseErrorMessage } from 'core/fb';
import { BasicErrorPage } from 'pages/error/BasicErrorPage';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';

const timeoutLimit = 6; // in seconds

const Join = () => {
  // context
  const api = useContextApi()!;
  const { signInWithEmailLink, signInResult } = useAuthentication();
  const { isLoading, isSuccess, isError, error } = signInResult;
  const link = window.location.href;
  const savedEmail = api.auth().getSignInEmail();
  const isLinkValid = api.auth().isSignInWithEmailLink(link);
  const isEmailSaved = Boolean(savedEmail);
  const { isBackofficeUser } = useContextStaffProfile();
  // state
  const [email, setEmail] = React.useState('');
  const [isTimeout, setIsTimeout] = React.useState(false);
  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);
  // handler
  const handleSingIn = React.useCallback(
    (email: string, link: string) => signInWithEmailLink({ email, link }),
    [signInWithEmailLink]
  );
  // side effects
  React.useEffect(() => {
    const timer = setTimeout(() => setIsTimeout(true), timeoutLimit * 1000);
    return () => clearTimeout(timer);
  }, []);
  React.useEffect(() => {
    emailRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    if (isLinkValid && isEmailSaved) {
      handleSingIn(savedEmail!, link);
    }
  }, [isLinkValid, isEmailSaved, handleSingIn, savedEmail, link]);
  // UI
  if (isSuccess) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else return <Redirect to="/app" />;
  }
  if (isTimeout && !isBackofficeUser && isEmailSaved && isError) {
    const errorMessage = getFirebaseErrorMessage(error);
    return (
      <BasicErrorPage
        title="Ocorreu um erro de autenticação."
        description={errorMessage}
        actionLabel={t('Voltar para o login')}
        actionPath="/login"
      />
    );
  }
  if (!isEmailSaved)
    return (
      <Center height="100vh">
        <Container mt="4">
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Logo />
          </Flex>
          <Text mt="10">{t('Confirme o seu e-mail, para continuar:')}</Text>
          <FormControl mt="2" isRequired>
            <CustomInput
              ref={emailRef}
              id="email"
              label={t('E-mail')}
              placeholder={t('Endereço de e-mail')}
              value={email}
              onChange={(ev) => setEmail(normalizeEmail(ev.target.value))}
            />
          </FormControl>
          <Button
            mt="6"
            width="full"
            onClick={() => handleSingIn(email, link)}
            isLoading={isLoading}
          >
            {t('Entrar')}
          </Button>
        </Container>
      </Center>
    );
  return <Loading timeout={timeoutLimit} />;
};

export default Join;
