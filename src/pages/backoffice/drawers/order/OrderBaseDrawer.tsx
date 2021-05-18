import {
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
  Text,
} from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  order?: WithId<Order> | null;
  isOpen: boolean;
  onClose(): void;
  updateOrderStatus(): void;
  isLoading: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const OrderBaseDrawer = ({
  agent,
  order,
  onClose,
  updateOrderStatus,
  isLoading,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {order?.code ?? 'N/E'}
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Pedido feito em:')}{' '}
              <Text as="span" fontWeight="500">
                {order?.createdOn
                  ? getDateAndHour(order.createdOn as firebase.firestore.Timestamp)
                  : 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {order?.updatedOn
                  ? getDateAndHour(order.updatedOn as firebase.firestore.Timestamp)
                  : 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Nome do cliente:')}{' '}
              <Text as="span" fontWeight="500">
                {order?.consumer?.name ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                {agent?.name}
              </Text>
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Flex
              my="8"
              fontSize="lg"
              flexDir="row"
              alignItems="flex-start"
              height="38px"
              borderBottom="1px solid #C8D7CB"
            >
              <DrawerLink to={`${url}`} label={t('Participantes')} />
              <DrawerLink to={`${url}/order`} label={t('Pedido')} />
              <DrawerLink to={`${url}/status`} label={t('Status')} />
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter borderTop="1px solid #F2F6EA">
            <HStack w="full" spacing={4}>
              <Button
                width="full"
                maxW="240px"
                fontSize="15px"
                onClick={updateOrderStatus}
                isLoading={isLoading}
                loadingText={t('Salvando')}
              >
                {t('Salvar alterações')}
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
