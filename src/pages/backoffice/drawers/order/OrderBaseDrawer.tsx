import { DispatchingState, IssueType, Order, OrderStatus, WithId } from '@appjusto/types';
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
  Text
} from '@chakra-ui/react';
import { MutationResult } from 'app/api/mutation/useCustomMutation';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
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
  order?: WithId<Order> | null;
  isOpen: boolean;
  onClose(): void;
  message?: string;
  updateState(type: string, value: OrderStatus | DispatchingState | IssueType | string): void;
  updateOrderStatus(value?: OrderStatus): void;
  updateOrderStaff(type: 'assume' | 'release'): void;
  updateStaffResult: MutationResult;
  cancellation(type?: 'prevention'): void;
  loadingState: OrderDrawerLoadingState;
  isChatMessages: boolean;
  deleteOrder(orderId: string): void;
  deleteLoading: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const OrderBaseDrawer = ({
  order,
  onClose,
  message,
  updateState,
  updateOrderStaff,
  updateStaffResult,
  updateOrderStatus,
  cancellation,
  loadingState,
  isChatMessages,
  deleteOrder,
  deleteLoading,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { url } = useRouteMatch();
  const { user, userAbility, isBackofficeSuperuser } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // helpers
  const orderStatus = order?.status as OrderStatus;
  const isFlagged = order?.status === 'charged' && order?.flagged;
  const canUpdateOrderStaff = order?.staff?.id === user?.uid || isBackofficeSuperuser;
  const canUpdateOrder = userAbility?.can('update', { kind: 'orders', ...order });
  const canDeleteOrder =
    order?.status === 'quote' && userAbility?.can('delete', { kind: 'orders', ...order });
  // handlers
  const handleConfirm = () => {
    if(order?.scheduledTo) {
      return updateOrderStatus('scheduled');
    } 
    return updateOrderStatus('confirmed');
  }
  const handleDelete = async () => {
    if (!order?.id) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'OrderBaseDrawer-handleDelete',
        message: { title: 'Parâmetros inválidos. O Id do pedido não existe.' },
      });
    }
    if (!canDeleteOrder) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'OrderBaseDrawer-handleDelete',
        message: { title: 'Usuário não tem permissão para excluir o pedido.' },
      });
    }
    try {
      await deleteOrder(order.id);
    } catch (error) { }
  };
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
            <Text mt="1" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Agente responsável:')}{' '}
              {typeof order?.staff?.id === 'string' ? (
                <>
                  <Text as="span" fontWeight="500">
                    {order.staff?.name ?? order.staff.email}
                  </Text>
                  {canUpdateOrderStaff && (
                    <Text
                      as="span"
                      ml="2"
                      fontWeight="500"
                      color="red"
                      textDecor="underline"
                      cursor="pointer"
                      onClick={() => updateOrderStaff('release')}
                    >
                      {updateStaffResult.isLoading ? t('(Saindo...)') : t('(Sair)')}
                    </Text>
                  )}
                </>
              ) : (
                <Text
                  as="span"
                  fontWeight="500"
                  color="green.600"
                  textDecor="underline"
                  cursor="pointer"
                  onClick={() => updateOrderStaff('assume')}
                >
                  {updateStaffResult.isLoading ? t('Assumindo...') : t('Assumir')}
                </Text>
              )}
            </Text>
            <BaseDrawerInfoItem label={t('ID:')} value={order?.id ?? 'N/E'} />
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
          </DrawerHeader>
          <DrawerBody pb="28">
            {isFlagged && (
              <FraudPrevention
                orderId={order?.id!}
                canUpdateOrder={canUpdateOrder}
                message={message}
                updateMessage={(message: string) => updateState('message', message)}
                handleConfirm={handleConfirm}
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
          <DrawerFooter display={canUpdateOrder ? 'flex' : 'none'} borderTop="1px solid #F2F6EA">
            <Flex w="full" direction="row" justifyContent="space-between">
              {isDeleting ? (
                <Box mt="8" w="100%" bg="#FFF8F8" border="1px solid red" borderRadius="lg" p="6">
                  <Text color="red">{t(`Tem certeza que deseja excluir este pedido?`)}</Text>
                  <HStack mt="4" spacing={4}>
                    <Button width="full" onClick={() => setIsDeleting(false)}>
                      {t(`Manter pedido`)}
                    </Button>
                    <Button
                      width="full"
                      variant="danger"
                      onClick={handleDelete}
                      isLoading={deleteLoading}
                      loadingText={t('Excluindo')}
                    >
                      {t(`Excluir`)}
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <>
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
                  {canDeleteOrder && (
                    <Button
                      width="full"
                      maxW="240px"
                      fontSize="15px"
                      variant="dangerLight"
                      onClick={() => setIsDeleting(true)}
                    >
                      {t('Excluir pedido')}
                    </Button>
                  )}
                </>
              )}
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
