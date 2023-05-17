import {
  DispatchingState,
  IssueType,
  Order,
  OrderStatus,
  WithId,
} from '@appjusto/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Text,
} from '@chakra-ui/react';
import { MutationResult } from 'app/api/mutation/useCustomMutation';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { OrderTracking } from 'pages/backoffice/dashboard/OrderTracking';
import { isLogisticsIncluded } from 'pages/logistics/utils';
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
  handleIssueOrder(): void;
  handleIssueOrderLoading: boolean;
  updateState(
    type: string,
    value: OrderStatus | DispatchingState | IssueType | string
  ): void;
  updateOrderStatus(value?: OrderStatus): void;
  updateOrderStaff(type: 'assume' | 'release'): void;
  updateStaffResult: MutationResult;
  cancellation(type?: 'prevention'): void;
  loadingState: OrderDrawerLoadingState;
  deleteOrder(orderId: string): void;
  deleteLoading: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const OrderBaseDrawer = ({
  order,
  onClose,
  message,
  handleIssueOrder,
  handleIssueOrderLoading,
  updateState,
  updateOrderStaff,
  updateStaffResult,
  updateOrderStatus,
  cancellation,
  loadingState,
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
  const orderStatus = order?.status!;
  const isFlagged = React.useMemo(
    () =>
      order?.status === 'charged' &&
      order?.flags &&
      order?.flags?.includes('unsafe'),
    [order?.status, order?.flags]
  );
  const logisticsIncluded = React.useMemo(
    () => isLogisticsIncluded(order?.fare?.courier?.payee),
    [order?.fare?.courier?.payee]
  );
  const showMatchingTab = React.useMemo(
    () =>
      order?.fulfillment === 'delivery' &&
      (logisticsIncluded || order.dispatchingStatus === 'outsourced'),
    [order?.fulfillment, logisticsIncluded, order?.dispatchingStatus]
  );
  const isChatMessages = React.useMemo(
    () => order?.flags && order.flags.includes('chat'),
    [order?.flags]
  );
  const canUpdateOrderStaff = React.useMemo(
    () => order?.staff?.id === user?.uid || isBackofficeSuperuser,
    [order?.staff?.id, user?.uid, isBackofficeSuperuser]
  );
  const canUpdateOrder = React.useMemo(
    () =>
      userAbility?.can('update', {
        kind: 'orders',
        ...order,
      }),
    [userAbility, order]
  );
  const canDeleteOrder = React.useMemo(
    () =>
      order?.status === 'quote' &&
      userAbility?.can('delete', { kind: 'orders', ...order }),
    [order, userAbility]
  );
  const isIssueOrder = React.useMemo(
    () =>
      order?.flags &&
      order?.flags?.includes('issue') &&
      userAbility?.can('update', { kind: 'orders', ...order }),
    [order, userAbility]
  );
  // handlers
  const handleConfirm = (removeStaff: boolean) => {
    if (order?.scheduledTo) {
      updateOrderStatus('scheduled');
    } else {
      updateOrderStatus('confirmed');
    }
    if (removeStaff) updateOrderStaff('release');
  };
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
      deleteOrder(order.id);
    } catch (error) {}
  };
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
              {order?.code ? `#${order.code}` : 'N/E'}
            </Text>
            <Text
              mt="1"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
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
                      {updateStaffResult.isLoading
                        ? t('(Saindo...)')
                        : t('(Sair)')}
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
                  {updateStaffResult.isLoading
                    ? t('Assumindo...')
                    : t('Assumir')}
                </Text>
              )}
            </Text>
            <BaseDrawerInfoItem label={t('ID:')} value={order?.id ?? 'N/E'} />
            <BaseDrawerInfoItem
              label={t('Nome do cliente:')}
              value={order?.consumer?.name ?? 'N/E'}
            />
            <Accordion defaultIndex={[0]} allowToggle>
              <AccordionItem px="0" borderTop="none">
                {({ isExpanded }: { isExpanded: boolean }) => (
                  <>
                    <AccordionPanel p="0">
                      <BaseDrawerInfoItem
                        label={t('Tipo:')}
                        value={order?.type === 'food' ? 'Comida' : 'p2p'}
                      />
                      {order?.type === 'food' && (
                        <BaseDrawerInfoItem
                          label={t('Tipo de entrega:')}
                          value={
                            order?.fulfillment === 'take-away'
                              ? 'Para retirar'
                              : 'Delivery'
                          }
                        />
                      )}
                      {order?.type === 'food' && (
                        <BaseDrawerInfoItem
                          label={t('Logística inclusa:')}
                          value={logisticsIncluded ? 'Sim' : 'Não'}
                        />
                      )}
                      <BaseDrawerInfoItem
                        label={t('Pedido confirmado em:')}
                        value={getDateAndHour(order?.timestamps.confirmed)}
                      />
                      <BaseDrawerInfoItem
                        label={t('Atualizado em:')}
                        value={getDateAndHour(order?.updatedOn)}
                      />
                      <BaseDrawerInfoItem
                        label={t('Aceito via:')}
                        value={order?.acceptedFrom ?? 'N/I'}
                      />
                      <BaseDrawerInfoItem
                        label={t('Tempo de preparo:')}
                        value={t(
                          `${
                            order?.cookingTime ? order?.cookingTime / 60 : 'N/I'
                          } min`
                        )}
                      />
                      <BaseDrawerInfoItem
                        label={t('Status:')}
                        value={
                          orderStatus
                            ? orderStatusPTOptions[orderStatus]
                            : 'N/E'
                        }
                      />
                      {order?.scheduledTo && (
                        <BaseDrawerInfoItem
                          label={t('Agendado para:')}
                          value={getDateAndHour(order.scheduledTo)}
                        />
                      )}
                      <BaseDrawerInfoItem
                        label={t('Mensagens no chat:')}
                        value={isChatMessages ? t('Sim') : t('Não')}
                      />
                      {order?.issue && (
                        <BaseDrawerInfoItem
                          label={t('Motivo da recusa:')}
                          value={order.issue}
                        />
                      )}
                    </AccordionPanel>
                    <Box>
                      <AccordionButton
                        mt="-20px"
                        mb="2"
                        p="0"
                        _focus={{ outline: 'none' }}
                      >
                        <Box
                          flex="1"
                          textAlign="right"
                          fontSize="15px"
                          fontWeight="500"
                          lineHeight="22px"
                          mr="2"
                        >
                          {isExpanded ? 'Ver menos' : 'Ver mais'}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </Box>
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </DrawerHeader>
          <DrawerBody pb="28">
            {isFlagged && (
              <FraudPrevention
                orderId={order?.id!}
                canUpdateOrder={canUpdateOrder}
                message={message}
                updateMessage={(message: string) =>
                  updateState('message', message)
                }
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
              <HStack spacing={0} overflowX="auto">
                <DrawerLink to={`${url}`} label={t('Participantes')} />
                <DrawerLink to={`${url}/order`} label={t('Pedido')} />
                <DrawerLink to={`${url}/invoices`} label={t('Faturas')} />
                {showMatchingTab && (
                  <DrawerLink to={`${url}/matching`} label={t('Matching')} />
                )}
                <DrawerLink to={`${url}/status`} label={t('Status')} />
                {isChatMessages && (
                  <DrawerLink to={`${url}/chats`} label={t('Chats')} />
                )}
              </HStack>
            </Flex>
            {children}
          </DrawerBody>
          <DrawerFooter
            display={canUpdateOrder ? 'flex' : 'none'}
            borderTop="1px solid #F2F6EA"
          >
            <Flex w="full" direction="row" justifyContent="space-between">
              {isDeleting ? (
                <Box
                  mt="8"
                  w="100%"
                  bg="#FFF8F8"
                  border="1px solid red"
                  borderRadius="lg"
                  p="6"
                >
                  <Text color="red">
                    {t(`Tem certeza que deseja excluir este pedido?`)}
                  </Text>
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
                  {isIssueOrder && (
                    <Button
                      width="full"
                      maxW="240px"
                      fontSize="15px"
                      variant="dangerLight"
                      onClick={handleIssueOrder}
                      isLoading={handleIssueOrderLoading}
                      loadingText={t('Tratando')}
                    >
                      {t('Problema tratado')}
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
