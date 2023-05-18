import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { isElectron } from '@firebase/util';
import { CustomPasswordInput } from 'common/components/form/input/CustomPasswordInput';
import { AppJustoEnv } from 'pages/types';
import React from 'react';
import { t } from 'utils/i18n';
import { FeedbackType } from './types';

const isDesktopApp = isElectron();

interface PasswordFormProps {
  passwd: string;
  onPasswdChange(passwd: string): void;
  handleSubmit(): void;
  isLoading: boolean;
  handleSignInLink(type: FeedbackType): void;
}

export const PasswordForm = ({
  passwd,
  onPasswdChange,
  handleSubmit,
  isLoading,
  handleSignInLink,
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
      <Button type="submit" width="full" h="60px" mt="6" isLoading={isLoading}>
        {t('Entrar')}
      </Button>
      <Box mt="8">
        {!isDesktopApp && (
          <Text
            textAlign="center"
            textDecor="underline"
            cursor="pointer"
            onClick={() => handleSignInLink('login')}
            color="green.700"
          >
            {t('Quero receber o link de acesso por email')}
          </Text>
        )}
        <Text
          mt={isDesktopApp ? '0' : '6'}
          textAlign="center"
          textDecor="underline"
          cursor="pointer"
          color="green.700"
        >
          {t('Quero redefinir a minha senha')}
        </Text>
        <Text mt="6" textAlign="center">
          {t('Sou novo no AppJusto e ')}
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
