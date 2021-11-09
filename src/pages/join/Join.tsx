import { Box, Button, Center, Container, Flex, FormControl, Text } from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { AlertWarning } from 'common/components/AlertWarning';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { Loading } from 'common/components/Loading';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';
import { UserNotFound } from './UserNotFound';

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
  const { isBackofficeUser } = useContextFirebaseUser();

  // state
  const [email, setEmail] = React.useState('');
  const [isTimeout, setIsTimeout] = React.useState(false);

  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);

  // side effects
  React.useEffect(() => {
    const timer = setTimeout(() => setIsTimeout(true), timeoutLimit * 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  React.useEffect(() => {
    if (isLinkValid && isEmailSaved) signInWithEmailLink({ email: savedEmail!, link });
  }, [isLinkValid, isEmailSaved, signInWithEmailLink, savedEmail, link]);

  // UI
  if (isTimeout && !isBackofficeUser) return <UserNotFound />;

  if (isSuccess) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else return <Redirect to="/app" />;
  }

  if (!isLinkValid)
    return (
      <Center height="100vh">
        <Container mt="4">
          <Flex w="100%" justifyContent="center" alignItems="center">
            <Logo />
          </Flex>
          <Text mt="8" fontSize="18px" lineHeight="22px" fontWeight="700" textAlign="center">
            {t('O link que você está tentando acessar não é válido =/')}
          </Text>
          <Text mt="4" fontSize="15px" lineHeight="21px" fontWeight="500" textAlign="center">
            {t(
              'Verifique se você acessou o último link de autenticação que foi enviado para o seu e-mail e tente novamente, ou volte para a tela de login e solicite um novo link.'
            )}
          </Text>
          <Flex w="100%" justifyContent="center" alignItems="center">
            <CustomButton mt="8" label={t('Voltar para a tela de Login')} link="/login" />
          </Flex>
        </Container>
      </Center>
    );

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
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </FormControl>
          <Button
            mt="6"
            width="full"
            onClick={() => signInWithEmailLink({ email, link })}
            isLoading={isLoading}
          >
            {t('Entrar')}
          </Button>
          <Box mt="6">
            {isError && (
              <AlertWarning
                title={t('Ocorreu um erro de autenticação!')}
                description={getErrorMessage(error) ?? t('Tenta de novo?')}
              />
            )}
          </Box>
        </Container>
      </Center>
    );

  return <Loading timeout={timeoutLimit} />;
};

export default Join;
