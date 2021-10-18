import { Box, Button, Flex, Heading, HStack, Image, Link, Text } from '@chakra-ui/react';
import { useContextApi } from 'app/state/api/context';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { AlertWarning } from 'common/components/AlertWarning';
import Container from 'common/components/Container';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomInput } from 'common/components/form/input/CustomInput';
import delivery from 'common/img/big-delivery.svg';
import React, { ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-query';
import { isEmailValid } from 'utils/email';
import { t } from 'utils/i18n';
import { Section } from './Section';

export const RegistrationForm = () => {
  // contex
  const api = useContextApi();
  // state
  const [email, setEmail] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const [formMsg, setFormMsg] = React.useState({ status: false, type: '', message: '' });
  const isEmailInvalid = React.useMemo(() => !isEmailValid(email), [email]);

  // mutations
  const [loginWithEmail, { isLoading, isSuccess, isError, error }] = useMutation((email: string) =>
    api.auth().sendSignInLinkToEmail(email)
  );

  // handlers
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
    await loginWithEmail(email);
  };

  // side effects
  React.useEffect(() => {
    if (isError) {
      console.dir(error);
      setFormMsg({
        status: true,
        type: 'error',
        message: 'Não foi possível acessar o servidor. Você poderia tentar novamente?',
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
    <Section
      position={{ base: 'relative', md: 'fixed' }}
      top={{ md: '0' }}
      mt={{ base: '-80px', md: '180px', lg: '140px' }}
      zIndex="800"
    >
      <Container pt="0" display="flex" justifyContent="flex-end">
        <Flex
          flexDir="column"
          maxW="370px"
          bg="white"
          border="1px solid #C8D7CB"
          p="24px"
          color="black"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box position="relative" width="84px">
              <Image src={delivery} />
            </Box>
          </Flex>
          <Heading mt="4" as="h2" fontSize="24px">
            {t('Cadastre-se agora!')}
          </Heading>
          <Text mt="3" fontSize="16px" fontFamily="Barlow">
            {t('Ganhe mais e tenha uma relação mais justa com seus clientes e entregadores!')}
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
                setEmail(event.target.value);
              }}
              isInvalid={email !== '' && isEmailInvalid}
              minW={[null, null, '300px']}
              mb={['16px', null, '0']}
            />
            <HStack mt="4" spacing={2} alignItems="center">
              <CustomCheckbox
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
        </Flex>
      </Container>
    </Section>
  );
};
