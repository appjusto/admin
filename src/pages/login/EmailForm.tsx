import { Button, Flex, Text } from '@chakra-ui/react';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { isEmailValid, normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';

interface EmailFormProps {
  email: string;
  onEmailChange(email: string): void;
  handleSubmit(): void;
}

export const EmailForm = ({
  email,
  onEmailChange,
  handleSubmit,
}: EmailFormProps) => {
  // context
  const { dispatchAppRequestResult } = useContextAppRequests();
  // state
  const [isEmailInvalid, setIsEmailInvalid] = React.useState(false);
  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isEmailInvalid) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'handleSubmit-email-invalid',
        message: {
          title: 'O e-mail informado não é válido. Corrija e tente novamente.',
        },
      });
    }
    handleSubmit();
  };
  // side effects
  React.useEffect(() => {
    emailRef?.current?.focus();
  }, []);
  React.useEffect(() => {
    const isInvalid = !isEmailValid(email);
    setIsEmailInvalid(isInvalid);
  }, [email]);
  // UI
  return (
    <Flex as="form" w="100%" flexDir="column" onSubmit={onSubmit}>
      <Text fontSize="xl" color="black" textAlign="center">
        {t('Entrar no painel do restaurante')}
      </Text>
      <Text fontSize="md" textAlign="center" color="gray.700">
        {t('Informe o seu e-mail')}
      </Text>
      <CustomInput
        ref={emailRef}
        isRequired
        type="email"
        id="login-email"
        label={t('E-mail')}
        placeholder={t('Endereço de e-mail')}
        value={email}
        handleChange={(ev) => onEmailChange(normalizeEmail(ev.target.value))}
        isInvalid={email !== '' && isEmailInvalid}
      />
      <Button type="submit" width="full" h="60px" mt="6">
        {t('Continuar')}
      </Button>
    </Flex>
  );
};
