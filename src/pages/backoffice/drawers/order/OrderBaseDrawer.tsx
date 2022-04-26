import { DispatchingState, IssueType, Order, OrderStatus, WithId } from '@appjusto/types';
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
import { useContextFirebaseUser } from 'app/state/auth/context';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import { OrderTracking } from 'pages/backoffice/dashboard/OrderTracking';
import { DrawerLink } from 'pages/menu/drawers/DrawerLink';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderDrawerLoadingState } from '.';
import { orderStatusPTOptions } from '../../utils/index';
import { SectionTitle } from '../generics/SectionTitle';
import { BaseDrawerInfoItem } from './BaseDrawerInfoItem';
import { FraudPrevention } from './FraudPrevention';

interface BaseDrawerProps {
  agent: { id: string | undefined; name: string };
  order?: WithId<Order> | null;
  isOpen: boolean;
  onClose(): void;
  message?: string;
  updateState(type: string, value: OrderStatus | DispatchingState | IssueType | string): void;
  updateOrderStatus(value?: OrderStatus): void;
  cancellation(type?: 'prevention'): void;
  loadingState: OrderDrawerLoadingState;
  isChatMessages: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const OrderBaseDrawer = ({
  agent,
  order,
  onClose,
  message,
  updateState,
  updateOrderStatus,
  cancellation,
  loadingState,
  isChatMessages,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { userAbility } = useContextFirebaseUser();
  const { url } = useRouteMatch();
  // helpers
  const orderStatus = order?.status as OrderStatus;
  const isFlagged = order?.status === 'charged' && order?.flagged;
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent mt={{ base: '16', lg: '0' }}>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {order?.code ? `#${order.code}` : 'N/E'}
            </Text>
            <BaseDrawerInfoItem
              label={t('Tipo:')}
              value={order?.type === 'food' ? 'Comida' : 'p2p'}
            />
            <BaseDrawerInfoItem
              label={t('Pedido confirmado em:')}
              value={getDateAndHour(order?.timestamps.confirmed)}
            />
            <BaseDrawerInfoItem
              label={t('Atualizado em:')}
              value={getDateAndHour(order?.updatedOn)}
            />
            <BaseDrawerInfoItem
              label={t('Tempo de preparo:')}
              value={t(`${order?.cookingTime ? order?.cookingTime / 60 : 'N/I'} min`)}
            />
            <BaseDrawerInfoItem
              label={t('Nome do cliente:')}
              value={order?.consumer?.name ?? 'N/E'}
            />
            <BaseDrawerInfoItem
              label={t('Status:')}
              value={orderStatus ? orderStatusPTOptions[orderStatus] : 'N/E'}
            />
            <BaseDrawerInfoItem
              label={t('Mensagens no chat:')}
              value={isChatMessages ? t('Sim') : t('Não')}
            />

            {order?.issue && (
              <BaseDrawerInfoItem label={t('Motivo da recusa:')} value={order.issue} />
            )}
            {/*<BaseDrawerInfoItem label={t('Agente responsável:')} value={???} />*/}
          </DrawerHeader>
          <DrawerBody pb="28">
            {isFlagged && (
              <FraudPrevention
                orderId={order?.id!}
                message={message}
                updateMessage={(message: string) => updateState('message', message)}
                handleConfirm={() => updateOrderStatus('confirmed')}
                handleCancel={() => cancellation('prevention')}
                loadingState={loadingState}
              />
            )}
            <SectionTitle mt="4" mb="4">
              {t('Andamento do pedido')}
            </SectionTitle>
            <OrderTracking orderId={order?.id} />
            <Flex mt="8" mb="6" fontSize="lg" borderBottom="1px solid #C8D7CB">
              {isChatMessages ? (
                <FiltersScrollBar>
                  <HStack spacing={4}>
                    <DrawerLink to={`${url}`} label={t('Participantes')} />
                    <DrawerLink to={`${url}/order`} label={t('Pedido')} />
                    <DrawerLink to={`${url}/invoices`} label={t('Faturas')} />
                    <DrawerLink to={`${url}/matching`} label={t('Matching')} />
                    <DrawerLink to={`${url}/status`} label={t('Status')} />
                    <DrawerLink to={`${url}/chats`} label={t('Chats')} />
                  </HStack>
                </FiltersScrollBar>
              ) : (
                <HStack spacing={4}>
                  <DrawerLink to={`${url}`} label={t('Participantes')} />
                  <DrawerLink to={`${url}/order`} label={t('Pedido')} />
                  <DrawerLink to={`${url}/invoices`} label={t('Faturas')} />
                  <DrawerLink to={`${url}/matching`} label={t('Matching')} />
                  <DrawerLink to={`${url}/status`} label={t('Status')} />
                </HStack>
              )}
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter
            display={userAbility?.can('update', 'orders') ? 'flex' : 'none'}
            borderTop="1px solid #F2F6EA"
          >
            <HStack w="full" spacing={4}>
              <Button
                width="full"
                maxW="240px"
                fontSize="15px"
                onClick={() => updateOrderStatus()}
                isLoading={loadingState === 'general'}
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
