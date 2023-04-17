import { CookingTimeMode, Order, WithId } from '@appjusto/types';
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
  Tooltip,
} from '@chakra-ui/react';
import { useBusinessTotalOrdersByConsumer } from 'app/api/order/useBusinessTotalOrdersByConsumer';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useOrdersContext } from 'app/state/order';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { phoneFormatter } from 'common/components/form/input/pattern-input/formatters';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { MdPrint } from 'react-icons/md';
import { useRouteMatch } from 'react-router-dom';
import { getDateAndHour, getHourAndMinute } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderStatusPTOptions } from '../../backoffice/utils/index';
import { getDatePlusTime, isScheduledMarginValid } from '../utils';

interface BaseDrawerProps {
  order?: WithId<Order> | null;
  cancellator: string;
  isOpen: boolean;
  cancel(): void;
  isCanceling: boolean;
  onClose(): void;
  children: React.ReactNode;
  printOrder?(): void;
  orderPrinting?: boolean;
  cookingTimeMode?: CookingTimeMode;
}

export const OrderBaseDrawer = ({
  order,
  cancellator,
  cancel,
  isCanceling,
  onClose,
  printOrder,
  orderPrinting,
  cookingTimeMode,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  const businessId = useContextBusinessId();
  const { changeOrderStatus } = useOrdersContext();
  const consumerTotalOrders = useBusinessTotalOrdersByConsumer(
    businessId,
    order?.consumer.id
  );
  // refs
  const bodyRef = React.useRef<HTMLDivElement>(null);
  // helpers
  const isHistory = path.includes('orders-history');
  const logisticsIncluded = React.useMemo(
    () => order?.fare?.courier?.payee === 'platform',
    [order?.fare?.courier?.payee]
  );
  const isDelivery = React.useMemo(
    () => order?.fulfillment === 'delivery',
    [order?.fulfillment]
  );
  const isOutsourced = React.useMemo(
    () => order?.dispatchingStatus === 'outsourced',
    [order?.dispatchingStatus]
  );
  const isOrderCompleted = React.useMemo(
    () => ['canceled', 'delivered'].includes(order?.status ?? 'not_included'),
    [order?.status]
  );
  const consumerOrders = React.useMemo(
    () =>
      consumerTotalOrders === null
        ? 'N/E'
        : consumerTotalOrders === undefined
        ? 'Carregando...'
        : consumerTotalOrders,
    [consumerTotalOrders]
  );
  const isScheduled = React.useMemo(
    () => order?.scheduledTo && order?.status === 'scheduled',
    [order?.scheduledTo, order?.status]
  );
  const isCookingTimeModeAuto = React.useMemo(
    () => cookingTimeMode === 'auto',
    [cookingTimeMode]
  );
  const isCurrierArrived = React.useMemo(
    () => order?.dispatchingState === 'arrived-pickup',
    [order?.dispatchingState]
  );
  const cannotCancelOrder = React.useMemo(
    () =>
      typeof order?.courier?.id === 'string' ||
      (isOutsourced && logisticsIncluded),
    [order?.courier?.id, isOutsourced, logisticsIncluded]
  );
  const showFooter = React.useMemo(
    () =>
      !isCanceling &&
      !isOrderCompleted &&
      (order?.status !== 'dispatching' || !logisticsIncluded),
    [isCanceling, isOrderCompleted, order?.status, logisticsIncluded]
  );
  const primaryButtonIsAble = React.useMemo(
    () =>
      (order?.status === 'scheduled' &&
        isScheduledMarginValid(order.scheduledTo, 5400)) ||
      (!(order?.status === 'preparing' && isCookingTimeModeAuto) &&
        (['confirmed', 'preparing'].includes(order?.status ?? 'not_included') ||
          (order?.status === 'ready' && !isDelivery) ||
          (order?.status === 'ready' && isCurrierArrived) ||
          !logisticsIncluded ||
          isOutsourced)),
    [
      order?.status,
      order?.scheduledTo,
      isCookingTimeModeAuto,
      isDelivery,
      isCurrierArrived,
      logisticsIncluded,
      isOutsourced,
    ]
  );
  const primaryButtonLabel = React.useMemo(() => {
    if (order?.status === 'scheduled') return 'Avançar pedido';
    if (order?.status === 'ready') {
      if (isDelivery) return 'Despachar pedido';
      return 'Entrega realizada';
    }
    if (order?.status === 'dispatching') return 'Entrega realizada';
    return 'Pedido pronto';
  }, [order?.status, isDelivery]);
  //handlers
  const handlePrint = React.useCallback(() => {
    if (printOrder) return printOrder();
    return null;
  }, [printOrder]);
  const orderConfirmation = React.useCallback(() => {
    if (!order?.id) return;
    if (orderPrinting) handlePrint();
    changeOrderStatus(order.id, 'preparing');
    onClose();
  }, [order?.id, orderPrinting, handlePrint, changeOrderStatus, onClose]);
  const PrimaryButtonFunction = React.useCallback(() => {
    if (order?.status === 'scheduled') changeOrderStatus(order.id, 'confirmed');
    if (order?.status === 'preparing') changeOrderStatus(order.id, 'ready');
    if (order?.status === 'ready' && isDelivery)
      changeOrderStatus(order.id, 'dispatching');
    if (order?.status === 'ready' && !isDelivery)
      changeOrderStatus(order.id, 'delivered');
    if (order?.status === 'dispatching' && !logisticsIncluded)
      changeOrderStatus(order.id, 'delivered');
    onClose();
  }, [
    order?.id,
    order?.status,
    isDelivery,
    changeOrderStatus,
    logisticsIncluded,
    onClose,
  ]);
  const updateCookingTimeScroll = React.useCallback(() => {
    if (!bodyRef.current) return;
    const scrollNumber = bodyRef.current.scrollHeight - 610;
    bodyRef.current.scrollTop = scrollNumber;
  }, []);
  // side effects
  React.useEffect(() => {
    if (isCanceling && bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [isCanceling]);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent
          mt={isHistory ? { base: '16', lg: '0' } : '0'}
          pt={isBackofficeUser ? '16' : 0}
        >
          <DrawerCloseButton
            bg="green.500"
            mr="12px"
            _focus={{ outline: 'none' }}
          />
          <DrawerHeader pb="2">
            <Flex
              flexDir={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ base: 'flex-start', md: 'flex-end' }}
            >
              <Flex flexDir="column">
                <HStack spacing={4}>
                  <Text
                    mt="4"
                    color="black"
                    fontSize="2xl"
                    fontWeight="700"
                    lineHeight="28px"
                    mb="2"
                  >
                    {t('Pedido Nº')} {order?.code}
                  </Text>
                  <Tooltip
                    placement="right"
                    label={t('Imprimir pedido')}
                    aria-label={t('Imprimir pedido')}
                  >
                    <Button
                      mt="4px !important"
                      size="sm"
                      variant="outline"
                      px="2"
                      h="25px"
                      _focus={{ outline: 'none' }}
                      onClick={() => handlePrint()}
                    >
                      <Icon as={MdPrint} w="20px" h="20px" />
                    </Button>
                  </Tooltip>
                </HStack>
                {order?.status === 'canceled' && (
                  <Text
                    fontSize="md"
                    color="red"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Pedido cancelado por:')}{' '}
                    <Text as="span">{cancellator}</Text>
                  </Text>
                )}
                <Text
                  fontSize="md"
                  color="gray.600"
                  fontWeight="500"
                  lineHeight="22px"
                >
                  {t('Nome do cliente:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {order?.consumer?.name ?? 'N/E'}
                  </Text>
                </Text>
                {order?.consumer.email && (
                  <Text
                    fontSize="md"
                    color="gray.600"
                    fontWeight="500"
                    lineHeight="22px"
                  >
                    {t('E-mail do cliente:')}{' '}
                    <Text as="span" color="black" fontWeight="700">
                      {order?.consumer.email}
                    </Text>
                  </Text>
                )}
                {order?.consumer?.phone && (
                  <Text
                    fontSize="md"
                    color="gray.600"
                    fontWeight="500"
                    lineHeight="22px"
                  >
                    {t('Fone do cliente:')}{' '}
                    <Text as="span" color="black" fontWeight="700">
                      {phoneFormatter(order.consumer.phone)}
                    </Text>
                  </Text>
                )}
                <Text
                  fontSize="md"
                  color="gray.600"
                  fontWeight="500"
                  lineHeight="22px"
                >
                  {t('Nº de pedidos:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {consumerOrders}
                  </Text>
                </Text>
                <Text
                  fontSize="md"
                  color="gray.600"
                  fontWeight="500"
                  lineHeight="22px"
                >
                  {t('Horário do pedido:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {getDateAndHour(
                      isScheduled
                        ? order?.timestamps.charged
                        : order?.timestamps.confirmed
                    )}
                  </Text>
                </Text>
                <Text
                  fontSize="md"
                  color="gray.600"
                  fontWeight="500"
                  lineHeight="22px"
                >
                  {t('Atualizado às:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {getDateAndHour(order?.updatedOn)}
                  </Text>
                </Text>
                <Text
                  fontSize="md"
                  color="gray.600"
                  fontWeight="500"
                  lineHeight="22px"
                >
                  {t('Tipo de entrega:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {order?.fulfillment === 'take-away'
                      ? 'Para retirar'
                      : 'Delivery'}
                  </Text>
                </Text>
                {order?.status && order?.status !== 'confirmed' && (
                  <Text
                    fontSize="md"
                    color="gray.600"
                    fontWeight="500"
                    lineHeight="22px"
                  >
                    {t('Status:')}{' '}
                    <Text as="span" color="black" fontWeight="700">
                      {order?.status
                        ? orderStatusPTOptions[order.status]
                        : 'N/E'}
                    </Text>
                  </Text>
                )}
                {isScheduled && (
                  <>
                    <Text
                      fontSize="md"
                      color="gray.600"
                      fontWeight="500"
                      lineHeight="22px"
                    >
                      {t('Início do preparo para:')}{' '}
                      <Text as="span" color="black" fontWeight="700">
                        {order?.confirmedScheduledTo
                          ? getDateAndHour(order.confirmedScheduledTo)
                          : 'N/E'}
                      </Text>
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.600"
                      fontWeight="500"
                      lineHeight="22px"
                    >
                      {t(
                        `Cliente solicitou ${
                          order?.fulfillment === 'take-away'
                            ? 'retirada'
                            : 'entrega'
                        } entre:`
                      )}{' '}
                      <Text as="span" color="black" fontWeight="700">
                        {getHourAndMinute(order?.scheduledTo!)}
                      </Text>
                      <Text as="span" color="black" fontWeight="700">
                        {` e ${getHourAndMinute(
                          getDatePlusTime(order?.scheduledTo)
                        )}`}
                      </Text>
                    </Text>
                  </>
                )}
              </Flex>
              <Flex flexDir="column">
                <CustomButton
                  label="Abrir chat com o cliente"
                  link={`/app/orders/chat/${order?.id}/${order?.consumer?.id}`}
                  size="sm"
                  variant="outline"
                />
              </Flex>
            </Flex>
            {order?.status === 'confirmed' && (
              <Flex
                flexDir={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
                mt="6"
                mb="2"
              >
                <Box>
                  <SectionTitle mt="0">{t('Detalhes do pedido')}</SectionTitle>
                  <Flex color="black" fontSize="xs">
                    <Text
                      fontSize="md"
                      color="gray.600"
                      fontWeight="500"
                      lineHeight="22px"
                    >
                      {t('Tempo de preparo:')}
                    </Text>
                    <Text ml="1" fontSize="md" fontWeight="700">
                      {t(
                        `${
                          order?.cookingTime ? order?.cookingTime / 60 : 'N/I'
                        } min`
                      )}
                      <Text
                        ml="2"
                        display={
                          isCookingTimeModeAuto ? 'none' : 'inline-block'
                        }
                        as="span"
                        color="#4EA031"
                        textDecor="underline"
                        cursor="pointer"
                        onClick={updateCookingTimeScroll}
                      >
                        {t('Alterar')}
                      </Text>
                    </Text>
                  </Flex>
                </Box>
                <Button
                  mt={{ base: '4', md: '0' }}
                  width="full"
                  maxW="260px"
                  fontSize="xl"
                  fontWeight="700"
                  letterSpacing="1px"
                  onClick={orderConfirmation}
                >
                  {t('CONFIRMAR PEDIDO')}
                </Button>
              </Flex>
            )}
          </DrawerHeader>
          <DrawerBody pos="relative" pb="28" ref={bodyRef}>
            <Box
              pos="absolute"
              top="0"
              left="0"
              w="100%"
              h={bodyRef.current?.scrollHeight}
              backgroundColor="white"
              zIndex="-100"
            />
            {children}
          </DrawerBody>
          {showFooter && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <Flex w="full" justifyContent="flex-start">
                <Flex
                  w="full"
                  maxW="607px"
                  pr="12"
                  flexDir="row"
                  justifyContent={
                    order?.status === 'confirmed'
                      ? 'flex-start'
                      : 'space-between'
                  }
                >
                  <Button
                    width="full"
                    maxW="200px"
                    variant="dangerLight"
                    onClick={cancel}
                    isDisabled={cannotCancelOrder}
                  >
                    {t('Cancelar pedido')}
                  </Button>
                  {order?.status !== 'confirmed' && (
                    <Button
                      isDisabled={!primaryButtonIsAble}
                      width="full"
                      maxW="200px"
                      onClick={PrimaryButtonFunction}
                    >
                      {t(primaryButtonLabel)}
                    </Button>
                  )}
                </Flex>
              </Flex>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
