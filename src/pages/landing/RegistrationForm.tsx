import {
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
} from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextMeasurement } from 'app/state/measurement/context';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { AlertWarning } from 'common/components/AlertWarning';
import { CustomInput } from 'common/components/form/input/CustomInput';
import Image from 'common/components/Image';
import logo from 'common/img/logo.svg';
import React, { ChangeEvent, FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { isEmailValid, normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';

export const RegistrationForm = () => {
  // contex
  const { sendSignInLinkToEmail, sendingLinkResult } = useAuthentication();
  const { isLoading, isSuccess, isError, error } = sendingLinkResult;
  const { handlePixelEvent } = useContextMeasurement();
  // state
  const [email, setEmail] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const [formMsg, setFormMsg] = React.useState({
    status: false,
    type: '',
    message: '',
  });
  const isEmailInvalid = React.useMemo(() => !isEmailValid(email), [email]);
  // handlers
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handlePixelEvent('admin-registration', { email });
    setFormMsg({ status: false, type: '', message: '' });
    if (!accept) {
      return setFormMsg({
        status: true,
        type: 'error',
        message: 'É preciso aceitar os termos de uso da plataforma.',
      });
    }
    if (isEmailInvalid) {
      return setFormMsg({
        status: true,
        type: 'error',
        message: 'O e-mail informado não é válido. Corrija e tente novamente.',
      });
    }
    sendSignInLinkToEmail(email);
  };
  // side effects
  React.useEffect(() => {
    if (isError) {
      console.dir(error);
      setFormMsg({
        status: true,
        type: 'error',
        message:
          'Não foi possível acessar o servidor. Você poderia tentar novamente?',
      });
    }
    if (isSuccess) {
      setFormMsg({
        status: true,
        type: 'success',
        message: 'Clique no link para confirmar',
      });
    }
  }, [isError, isSuccess, error]);
  // UI
  return (
    <Flex flexDir="column" p="6" color="black" textAlign="center">
      <Flex justifyContent="center">
        <Image src={logo} scrollCheck={false} mb="8" w="104px" />
      </Flex>
      <Heading mt="4" as="h2" fontSize="24px">
        {t('Cadastre-se agora!')}
      </Heading>
      <Text mt="3">
        {t(
          'Apoie um delivery que combate taxas abusivas e a precarização do trabalho'
        )}
      </Text>
      <form onSubmit={handleSubmit}>
        <CustomInput
          isRequired
          type="email"
          id="registration-email"
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          handleChange={(event: ChangeEvent<HTMLInputElement>) => {
            setEmail(normalizeEmail(event.target.value));
          }}
          isInvalid={email !== '' && isEmailInvalid}
          minW={[null, null, '300px']}
          mb={['16px', null, '0']}
        />
        <HStack mt="4" spacing={2} alignItems="center">
          <Checkbox
            colorScheme="green"
            isChecked={accept}
            onChange={(event) => setAccept(event.target.checked)}
          />
          <Link
            href="https://github.com/appjusto/docs/blob/main/legal/termos-de-uso-restaurantes.md"
            isExternal
            textDecor="underline"
          >
            {t('Li e aceito os termos de uso')}
          </Link>
        </HStack>
        {!isSuccess ? (
          <Button
            mt="4"
            w="100%"
            type="submit"
            variant="registration"
            isLoading={isLoading}
            loadingText={t('Enviando')}
          >
            {t('Começar cadastro')}
          </Button>
        ) : (
          <AlertSuccess
            title={t('Link enviado para o seu e-mail')}
            description={formMsg.message}
            fontSize="sm"
          />
        )}
        {formMsg.type !== 'error' && (
          <Text mt="4" fontSize="xs" lineHeight="lg">
            {t(
              'Ao cadastrar, você aceita receber contato por telefone, e-mail ou whatsapp quando necessário'
            )}
          </Text>
        )}
      </form>
      {formMsg.type === 'error' && (
        <AlertWarning
          //title={t('Erro de envio')}
          description={formMsg.message}
          fontSize="sm"
        />
      )}
      <Flex
        mt="6"
        pt="4"
        borderTop="1px solid #C8D7CB"
        flexDir="column"
        gap="4"
      >
        <Text>Já possui uma conta?</Text>
        <Link as={RouterLink} to="/login">
          <Button w="100%">{t('Entrar')}</Button>
        </Link>
      </Flex>
    </Flex>
  );
};
