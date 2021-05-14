import { Box, Button, Checkbox, Flex, Heading, HStack, Image, Link, Text } from '@chakra-ui/react';
import { useContextApi } from 'app/state/api/context';
import { AlertSuccess } from 'common/components/AlertSuccess';
import { AlertWarning } from 'common/components/AlertWarning';
import { CustomButton } from 'common/components/buttons/CustomButton';
import Container from 'common/components/Container';
import { CustomInput } from 'common/components/form/input/CustomInput';
import delivery from 'common/img/big-delivery.svg';
import React, { ChangeEvent, FormEvent } from 'react';
import { useMutation } from 'react-query';
import { t } from 'utils/i18n';
import { Section } from './Section';

export const RegistrationForm = () => {
  // contex
  const api = useContextApi();
  // state
  const [email, setEmail] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const [formMsg, setFormMsg] = React.useState({ status: false, type: '', message: '' });

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
      mt={{ base: '-80px', md: '100px' }}
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
            <CustomButton
              mt="0"
              variant="white"
              size="lg"
              link="/app"
              fontSize="sm"
              lineHeight="21px"
              label={t('Já sou cadastrado')}
            />
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
              minW={[null, null, '300px']}
              mb={['16px', null, '0']}
            />
            <HStack mt="4" spacing={2} alignItems="center">
              <Checkbox
                size="lg"
                colorScheme="green"
                borderColor="black"
                borderRadius="lg"
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
