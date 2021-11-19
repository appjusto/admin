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
import { Order, OrderStatus, WithId } from 'appjusto-types';
import { OrderTracking } from 'pages/backoffice/dashboard/OrderTracking';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderStatusPTOptions } from '../../utils/index';
import { SectionTitle } from '../generics/SectionTitle';
import { FraudPrevention } from './FraudPrevention';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  order?: WithId<Order> | null;
  isOpen: boolean;
  onClose(): void;
  updateOrderStatus(value?: OrderStatus): void;
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
  // helpers
  const orderStatus = order?.status as OrderStatus;
  const isFlagged = order?.status === 'charged' && order?.flagged;
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="0">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {order?.code ? `#${order.code}` : 'N/E'}
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Tipo:')}{' '}
              <Text as="span" fontWeight="500">
                {order?.type === 'food' ? 'Comida' : 'p2p'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Pedido confirmado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(order?.confirmedOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Atualizado em:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(order?.updatedOn)}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Nome do cliente:')}{' '}
              <Text as="span" fontWeight="500">
                {order?.consumer?.name ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {orderStatus ? orderStatusPTOptions[orderStatus] : 'N/E'}
              </Text>
            </Text>
            {order?.issue && (
              <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Motivo da recusa:')}{' '}
                <Text as="span" fontWeight="500">
                  {order.issue}
                </Text>
              </Text>
            )}
            {/*<Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              <Text as="span" fontWeight="500">
                *
              </Text>
            </Text>*/}
          </DrawerHeader>
          <DrawerBody pb="28">
            {isFlagged && (
              <FraudPrevention
                orderId={order?.id!}
                handleConfirm={() => updateOrderStatus('confirmed')}
                handleReject={() => {}}
              />
            )}
            <SectionTitle mb="4">{t('Andamento do pedido')}</SectionTitle>
            <OrderTracking orderId={order?.id} />
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
              <DrawerLink to={`${url}/invoices`} label={t('Faturas')} />
              <DrawerLink to={`${url}/matching`} label={t('Matching')} />
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
                onClick={() => updateOrderStatus()}
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
