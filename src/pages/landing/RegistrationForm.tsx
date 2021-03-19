import { Box, Button, Checkbox, Flex, Heading, HStack, Image, Link, Text } from '@chakra-ui/react';
import { AlertWarning } from 'common/components/AlertWarning';
//import CustomComboInput from '../../CustomComboInput'
import { CustomInput } from 'common/components/form/input/CustomInput';
import delivery from 'common/img/big-delivery.svg';
import React, { ChangeEvent, FormEvent } from 'react';
import { t } from 'utils/i18n';

export const RegistrationForm = () => {
  // state
  const [email, setEmail] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const [error, setError] = React.useState({ status: false, message: '' });
  // handlers
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accept) {
      return setError({
        status: true,
        message: 'É preciso aceitar os termos de uso da plataforma.',
      });
    }
    setError({ status: false, message: '' });
    console.log('Registrar', email);
  };
  // UI
  return (
    <Flex
      position="absolute"
      top={{ base: '-90px', md: '340px', lg: '240px', xl: '610px' }}
      right="0"
      mx={{ base: '16px', md: '0' }}
      flexDir="column"
      maxW="368px"
      bg="white"
      border="1px solid #C8D7CB"
      p="24px"
      color="black"
      zIndex="999"
    >
      <Box position="relative" width="84px" mt="-50px">
        <Image src={delivery} />
      </Box>
      <Heading mt="4" as="h2" fontSize="24px">
        {t('Cadastre-se agora!')}
      </Heading>
      <Text mt="4" fontSize="16px" fontFamily="Barlow">
        {t(
          'Ganhe mais no seu restaurante, e tenha uma experiência mais justa para seus clientes e entregadores!'
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
            href="https://github.com/appjusto/docs/blob/main/legal/termo-tratamento-de-dados.md"
            isExternal
          >
            {t('Li e aceito os termos de uso')}
          </Link>
        </HStack>
        <Button mt="4" w="100%" type="submit" variant="registration">
          {t('Começar cadastro')}
        </Button>
        <Text mt="4" fontSize="xs" lineHeight="lg">
          {t(
            'Ao começar o cadastro, você aceita receber nosso contato por telefone, e-mail ou whatsapp quando for necessário'
          )}
        </Text>
      </form>
      {error.status && <AlertWarning title={t('Termos de uso')} description={error.message} />}
    </Flex>
  );
};
