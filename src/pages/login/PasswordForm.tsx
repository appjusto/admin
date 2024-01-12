import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { isElectron } from '@firebase/util';
import { CustomPasswordInput } from 'common/components/form/input/CustomPasswordInput';
import { AppJustoEnv } from 'pages/types';
import React from 'react';
import { t } from 'utils/i18n';
import { FeedbackType, SignInStep } from './types';

const isDesktopApp = isElectron();

interface PasswordFormProps {
  passwd: string;
  onPasswdChange(passwd: string): void;
  handleSubmit(): void;
  isLoading: boolean;
  handleSignInLink(type: FeedbackType): void;
  handleStep(step: SignInStep): void;
}

export const PasswordForm = ({
  passwd,
  onPasswdChange,
  handleSubmit,
  isLoading,
  handleSignInLink,
  handleStep,
}: PasswordFormProps) => {
  // refs
  const passwdRef = React.useRef<HTMLInputElement>(null);
  // helpers
  const desktopLink = React.useMemo(() => {
    const env = process.env.REACT_APP_ENVIRONMENT as AppJustoEnv;
    return `https://${env === 'live' ? '' : `${env}.`}admin.appjusto.com.br/`;
  }, []);
  // handlers
  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleSubmit();
  };
  // side effects
  React.useEffect(() => {
    passwdRef?.current?.focus();
  }, []);
  // UI
  return (
    <Flex as="form" w="100%" flexDir="column" onSubmit={onSubmit}>
      <Text fontSize="xl" color="black" textAlign="center">
        {t('Entrar no painel do restaurante')}
      </Text>
      <Text fontSize="md" textAlign="center" color="gray.700">
        {t('Agora informe sua senha ou escolha outra opção abaixo')}
      </Text>
      <CustomPasswordInput
        ref={passwdRef}
        isRequired
        id="login-password"
        label={t('Senha')}
        aria-label="password-input"
        placeholder={t('Senha de acesso')}
        value={passwd}
        handleChange={(ev) => onPasswdChange(ev.target.value)}
      />
      <Text mt="2" fontSize="sm" textDecor="underline" color="green.700">
        <Text as="span" cursor="pointer" onClick={() => handleStep('reset')}>
          {t('Esqueci a senha')}
        </Text>
      </Text>
      <Button type="submit" width="full" h="60px" mt="6" isLoading={isLoading}>
        {t('Entrar')}
      </Button>
      <Box mt="12">
        <Box
          mb="8"
          borderTop="1px solid"
          borderColor="gray.500"
          mx={{ base: '0', md: '10%' }}
        />
        {!isDesktopApp && (
          <Text textAlign="center" textDecor="underline" color="green.700">
            <Text
              as="span"
              cursor="pointer"
              onClick={() => handleSignInLink('login')}
            >
              {t('Quero receber o link de acesso por e-mail')}
            </Text>
          </Text>
        )}

        <Text mt="6" textAlign="center" fontSize="xs">
          {t('Sou novo no appjusto e ')}
          {!isDesktopApp ? (
            <Text
              as="span"
              textDecor="underline"
              cursor="pointer"
              onClick={() => handleSignInLink('singup')}
              color="green.700"
            >
              {t('quero criar uma conta')}
            </Text>
          ) : (
            <Link href={desktopLink} isExternal>
              <Text
                as="span"
                textDecor="underline"
                cursor="pointer"
                color="green.700"
              >
                {t('quero criar uma conta')}
              </Text>
            </Link>
          )}
        </Text>
      </Box>
    </Flex>
  );
};
