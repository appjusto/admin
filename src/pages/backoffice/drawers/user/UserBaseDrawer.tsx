import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useObserveUser } from 'app/api/users/useObserveUser';
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
  const user = useObserveUser(userId);
  //UI
  if (!user)
    return (
      <Drawer placement="right" size="lg" onClose={onClose} {...props}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
            <DrawerHeader pb="2">
              <Skeleton maxW="200px" />
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Última requisição:')} <Skeleton maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('CPF:')} <Skeleton maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Fone:')} <Skeleton maxW="100px" />
              </Text>
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Bloqueado:')} <Skeleton maxW="100px" />
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
            <SectionTitle>{t('Logado como:')}</SectionTitle>
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
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
