import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { isEmailValid, normalizeEmail } from 'utils/email';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { generatePassword } from './utils';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const CreateUserDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { createUserWithEmailAndPassword, createUserResult } =
    useAuthentication();
  const { dispatchAppRequestResult } = useContextAppRequests();
  // state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  const isEmailInvalid = React.useMemo(() => !isEmailValid(email), [email]);
  // refs
  const emailRef = React.useRef<HTMLInputElement>(null);
  // handlers
  const createUser = () => {
    // validation
    if (userAbility?.cannot('create', 'users')) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'createUser-permission-denied',
        message: {
          title: 'O usuário não possui permissão para realizar esta operação.',
        },
      });
    }
    if (isEmailInvalid) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'createUser-email-invalid',
        message: {
          title: 'O e-mail informado não é válido. Corrija e tente novamente.',
        },
      });
    }
    if (!password) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'createUser-password-invalid',
        message: {
          title: 'Não foi possível gerar uma senha aleatória.',
        },
      });
    }
    // creation
    createUserWithEmailAndPassword({ email, password });
  };
  // side effects
  React.useEffect(() => {
    if (password) return;
    const random = generatePassword();
    setPassword(random);
  }, [password]);
  React.useEffect(() => {
    if (!createUserResult.isSuccess) return;
    setIsSuccess(true);
  }, [createUserResult.isSuccess]);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', lg: '0' }}>
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="2">
            <Text
              color="black"
              fontSize="2xl"
              fontWeight="700"
              lineHeight="28px"
              mb="2"
            >
              {t('Criar novo usuário')}
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Text fontSize="md">
              {t(
                'É importante realizar uma troca de e-mails, para validar a existência e propriedade do e-mail que será utilizado para criar o novo usuário. Uma senha aleatória gerada será exibida após esta criação.'
              )}
            </Text>
            <Flex mt="4" flexDir="row">
              <Icon mt="1" as={MdInfoOutline} />
              <Text ml="2" fontSize="15px" fontWeight="500" lineHeight="22px">
                {t('Após a criação do usuário, ')}
                <Text as="span" fontWeight="700">
                  {t(
                    'lembre-se de copiar os dados de acesso, pois essa informação não poderá ser recuperada posteriormente.'
                  )}
                </Text>
              </Text>
            </Flex>
            {isSuccess ? (
              <Box>
                <SectionTitle>{t('Dados de acesso:')}</SectionTitle>
                <Text
                  fontSize="15px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Email:')}{' '}
                  <Text as="span" fontWeight="500">
                    {email ?? 'N/E'}
                  </Text>
                </Text>
                <Text
                  fontSize="15px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Senha:')}{' '}
                  <Text as="span" fontWeight="500">
                    {password ?? 'N/E'}
                  </Text>
                </Text>
              </Box>
            ) : (
              <Box>
                <CustomInput
                  ref={emailRef}
                  type="email"
                  id="login-email"
                  label={t('E-mail')}
                  placeholder={t('Endereço de e-mail')}
                  value={email}
                  handleChange={(ev) =>
                    setEmail(normalizeEmail(ev.target.value))
                  }
                  isInvalid={email !== '' && isEmailInvalid}
                  isRequired
                />
              </Box>
            )}
          </DrawerBody>
          {!isSuccess && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <HStack w="100%" spacing={4}>
                <Button
                  width="full"
                  fontSize="15px"
                  onClick={createUser}
                  isLoading={createUserResult.isLoading}
                  loadingText={t('Criando')}
                  isDisabled={email.length === 0 || isEmailInvalid}
                >
                  {t('Criar usuário')}
                </Button>
                <Button
                  width="full"
                  fontSize="15px"
                  variant="dangerLight"
                  onClick={onClose}
                >
                  {t('Cancelar')}
                </Button>
              </HStack>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
