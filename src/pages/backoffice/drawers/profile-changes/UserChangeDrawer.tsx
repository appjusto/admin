import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Link,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import * as cpfutils from '@fnando/cpf';
import { useFetchUserData } from 'app/api/users/useFetchUserData';
import { useObserveUserChanges } from 'app/api/users/useObserveUserChanges';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import { situationPTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { birthdayFormatter } from '../courier/register/utils';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  changesId: string;
};

const userTypePTOption = {
  courier: 'Entregador',
  consumer: 'Consumidor',
  manager: 'Manager',
};

const UserChangeDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { changesId } = useParams<Params>();
  const { changes, updateChange, updateChangeResult } =
    useObserveUserChanges(changesId);
  const { isLoading, isSuccess } = updateChangeResult;
  const user = useFetchUserData(changes?.accountId, changes?.userType);
  // refs
  const actionType = React.useRef<'approved' | 'rejected'>();
  // helpers
  const profileLink = React.useMemo(() => {
    if (!user?.id) return undefined;
    if (!['consumer', 'courier'].includes(changes?.userType ?? 'undefined'))
      return undefined;
    let page = 'consumers';
    if (changes?.userType === 'courier') page = 'couriers';
    return `/backoffice/${page}/${user?.id}`;
  }, [user?.id, changes?.userType]);
  // handlers
  const updateChangesSituation = (situation: 'approved' | 'rejected') => {
    actionType.current = situation;
    return updateChange({ situation });
  };
  // side effects
  React.useEffect(() => {
    if (!isSuccess) return;
    onClose();
  }, [isSuccess, onClose]);
  //UI
  if (changes === undefined)
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
              <SectionTitle>{t('Dados do usuário')}</SectionTitle>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('AccountId:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Primeira correspondência como:')}{' '}
                <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Nome:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Sobrenome:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('CPF:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Fone:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Status:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Criado em:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text
                mt="1"
                fontSize="15px"
                color="black"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Atualizado em:')} <Skeleton as="span" maxW="100px" />
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28"></DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  if (changes === null)
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
                {changesId ?? 'N/E'}
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28">
              <SectionTitle>
                {t('Solicitação de alteração não encontrada! =/')}
              </SectionTitle>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
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
            <SectionTitle mt="0">{t('Dados do usuário')}</SectionTitle>
            <Text
              mt="6"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('AccountId:')}{' '}
              {profileLink ? (
                <Link
                  as={RouterLink}
                  to={profileLink}
                  fontWeight="500"
                  textDecor="underline"
                >
                  {user?.id ?? 'N/E'}
                </Link>
              ) : (
                <Text as="span" fontWeight="500">
                  {user?.id ?? 'N/E'}
                </Text>
              )}
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Tipo de perfil:')}{' '}
              <Text as="span" fontWeight="500">
                {changes?.userType
                  ? userTypePTOption[changes?.userType]
                  : 'N/E'}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Nome:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.name ?? 'N/E'}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Sobrenome:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.surname ?? 'N/E'}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('CPF:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.cpf ? cpfutils.format(user.cpf) : 'N/I'}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Fone:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.phone ? phoneFormatter(user.phone) : 'N/I'}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.situation ? situationPTOptions[user?.situation] : 'N/E'}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Criado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(user?.createdOn)}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(user?.updatedOn)}
              </Text>
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle mb="5">
              {t('Solicitando alteração dos seguintes dados:')}
            </SectionTitle>
            {changes?.name && (
              <Text
                mt="1"
                fontSize="15px"
                color="red"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Nome:')}{' '}
                <Text as="span" fontWeight="500">
                  {changes.name}
                </Text>
              </Text>
            )}
            {changes?.surname && (
              <Text
                mt="1"
                fontSize="15px"
                color="red"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Sobrenome:')}{' '}
                <Text as="span" fontWeight="500">
                  {changes.surname}
                </Text>
              </Text>
            )}
            {changes?.cpf && (
              <Text
                mt="1"
                fontSize="15px"
                color="red"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('CPF:')}{' '}
                <Text as="span" fontWeight="500">
                  {cpfutils.format(changes.cpf)}
                </Text>
              </Text>
            )}
            {changes?.phone && (
              <Text
                mt="1"
                fontSize="15px"
                color="red"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Fone:')}{' '}
                <Text as="span" fontWeight="500">
                  {changes?.phone ? phoneFormatter(changes.phone) : 'N/I'}
                </Text>
              </Text>
            )}
            {changes?.birthday && (
              <Text
                mt="1"
                fontSize="15px"
                color="red"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Data de nascimento:')}{' '}
                <Text as="span" fontWeight="500">
                  {birthdayFormatter('display', changes?.birthday)}
                </Text>
              </Text>
            )}
            {changes?.images && (
              <Text
                mt="1"
                fontSize="15px"
                color="red"
                fontWeight="700"
                lineHeight="22px"
              >
                {t('Imagens pendentes')}
              </Text>
            )}
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Criada em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(changes?.createdOn)}
              </Text>
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {changes?.situation
                  ? situationPTOptions[changes.situation]
                  : 'N/E'}
              </Text>
            </Text>
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <HStack w="full" spacing={4}>
              <Button
                width="full"
                fontSize="15px"
                onClick={() => updateChangesSituation('approved')}
                isLoading={isLoading && actionType.current === 'approved'}
                loadingText={t('Aprovando')}
              >
                {t('Aprovar')}
              </Button>
              <Button
                width="full"
                fontSize="15px"
                variant="dangerLight"
                onClick={() => updateChangesSituation('rejected')}
                isLoading={isLoading && actionType.current === 'rejected'}
                loadingText={t('Rejeitando')}
              >
                {t('Rejeitar')}
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default UserChangeDrawer;
