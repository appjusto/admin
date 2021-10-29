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
  HStack,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useObserveUser } from 'app/api/users/useObserveUser';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import React from 'react';
import { useParams } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  userId: string;
};

export const UserBaseDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { userId } = useParams<Params>();
  const { user, updateUser, updateResult } = useObserveUser(userId);
  const { isLoading, isSuccess, isError, error: updateError } = updateResult;
  // state
  const [isBlocking, setIsBlocking] = React.useState(false);
  const [error, setError] = React.useState(initialError);
  // refs
  const submission = React.useRef(0);
  // handlers
  const handleBlock = () => {
    submission.current += 1;
    console.log(`blocked: ${!user?.blocked}`);
    //updateUser({ blocked: !user?.blocked });
  };
  // side effects
  React.useEffect(() => {
    if (isError) {
      setError({
        status: true,
        error: updateError,
      });
    }
  }, [isError, updateError]);
  //UI
  if (user === undefined)
    return (
      <Drawer placement="right" size="lg" onClose={onClose} {...props}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
            <DrawerHeader pb="2">
              <Skeleton maxW="200px" />
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Última requisição:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('CPF:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Fone:')} <Skeleton as="span" maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Bloqueado:')} <Skeleton as="span" maxW="100px" />
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28"></DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  if (user === null)
    return (
      <Drawer placement="right" size="lg" onClose={onClose} {...props}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
            <DrawerHeader pb="2">
              <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                {t('Usuário não encontrado')}
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Última requisição:')}{' '}
                <Text as="span" fontWeight="500">
                  N/I
                </Text>
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('CPF:')}{' '}
                <Text as="span" fontWeight="500">
                  N/I
                </Text>
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Fone:')}{' '}
                <Text as="span" fontWeight="500">
                  N/I
                </Text>
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Bloqueado:')}{' '}
                <Text as="span" fontWeight="500">
                  N/I
                </Text>
              </Text>
            </DrawerHeader>
            <DrawerBody pb="28"></DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {user?.id ?? 'N/E'}
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Última requisição:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(user?.lastSignInRequest)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('CPF:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.cpf ?? 'N/I'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Fone:')}{' '}
              <Text as="span" fontWeight="500">
                {user?.phone ?? 'N/I'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Bloqueado:')}{' '}
              <Text as="span" fontWeight="500" color={user?.blocked ? 'red' : 'black'}>
                {user?.blocked ? 'Sim' : 'Não'}
              </Text>
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <SectionTitle>
              {!user?.manager && !user?.courier && !user?.consumer
                ? t('Ainda não houve tentativa de login')
                : t('Logado como:')}
            </SectionTitle>
            {user?.manager && (
              <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Manager, em:')}{' '}
                <Text as="span" fontWeight="500">
                  {user.manager?.createdAt ? getDateAndHour(user.manager.createdAt) : 'N/I'}
                </Text>
              </Text>
            )}
            {user?.courier && (
              <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Entregador, em:')}{' '}
                <Text as="span" fontWeight="500">
                  {user.courier?.createdAt ? getDateAndHour(user.courier.createdAt) : 'N/I'}
                </Text>
              </Text>
            )}
            {user?.consumer && (
              <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Consumidor, em:')}{' '}
                <Text as="span" fontWeight="500">
                  {user.consumer?.createdAt ? getDateAndHour(user.consumer.createdAt) : 'N/I'}
                </Text>
              </Text>
            )}
            {user?.comment && (
              <>
                <SectionTitle>{t('Observação:')}</SectionTitle>
                <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                  {user.comment}
                </Text>
              </>
            )}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            {isBlocking ? (
              <Box mt="8" w="100%" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
                <Text color="red">
                  {user.blocked
                    ? t(`Tem certeza que deseja desbloquear este usuário?`)
                    : t(`Tem certeza que deseja bloquear este usuário?`)}
                </Text>
                <HStack mt="4" spacing={4}>
                  <Button width="full" onClick={() => setIsBlocking(false)}>
                    {t(`Cancelar`)}
                  </Button>
                  <Button width="full" variant="danger" onClick={handleBlock} isLoading={isLoading}>
                    {user.blocked ? t(`Desbloquear`) : t(`Bloquear`)}
                  </Button>
                </HStack>
              </Box>
            ) : (
              <HStack w="100%" spacing={4}>
                <Button
                  minW={{ base: '100%', md: '220px' }}
                  fontSize="15px"
                  variant="dangerLight"
                  onClick={() => setIsBlocking(true)}
                >
                  {user.blocked ? t(`Desbloquear usuário`) : t(`Bloquear usuário`)}
                </Button>
              </HStack>
            )}
            <SuccessAndErrorHandler
              submission={submission.current}
              isSuccess={isSuccess}
              isError={error.status}
              error={error.error}
              errorMessage={error.message}
            />
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
