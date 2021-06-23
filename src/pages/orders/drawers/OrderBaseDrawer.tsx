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
  Text,
} from '@chakra-ui/react';
import { useOrderStatusTimestamp } from 'app/api/order/useOrderStatusTimestamp';
import { useContextBusiness } from 'app/state/business/context';
import { useOrdersContext } from 'app/state/order';
import { Order, WithId } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderStatusPTOptions } from '../../backoffice/utils/index';
import { OrderAcceptButton } from './OrderAcceptButton';

interface BaseDrawerProps {
  order?: WithId<Order> | null;
  cancellator: string;
  isOpen: boolean;
  cancel(): void;
  isCanceling: boolean;
  onClose(): void;
  children: React.ReactNode;
}

const statusConfirmed = 'confirmed';

export const OrderBaseDrawer = ({
  order,
  cancellator,
  cancel,
  isCanceling,
  onClose,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { business } = useContextBusiness();
  const orderConfirmedTimestamp = useOrderStatusTimestamp(order?.id, statusConfirmed);
  const { changeOrderStatus } = useOrdersContext();

  // refs
  const bodyRef = React.useRef<HTMLDivElement>(null);

  // helpers
  const isCurrierArrived = order?.dispatchingState === 'arrived-pickup';
  // const cancelator = orderCancelator(order?.cancellation?.issue.type);

  //handlers
  const PrimaryButtonFunction = () => {
    if (order?.status === 'confirmed') {
      if (business?.orderPrinting) console.log('PRINT !!!');
      changeOrderStatus(order.id, 'preparing');
    }
    if (order?.status === 'preparing') changeOrderStatus(order.id, 'ready');
    if (order?.status === 'ready') changeOrderStatus(order.id, 'dispatching');
    onClose();
  };

  const scrollBodyToBottom = () => {
    if (!bodyRef.current) return;
    const scrollNumber = bodyRef.current.scrollHeight - 660;
    return (bodyRef.current.scrollTop = scrollNumber);
  };

  //UI conditions
  let orderDispatched = ['dispatching', 'delivered'].includes(order?.status ?? 'not_included');

  let PrimaryButtonAble =
    ['confirmed', 'preparing'].includes(order?.status ?? 'not_included') ||
    (order?.status === 'ready' && isCurrierArrived);

  let PrimaryButtonLabel = 'CONFIRMAR';
  if (order?.status === 'preparing') PrimaryButtonLabel = 'Pedido pronto';
  if (order?.status === 'ready') PrimaryButtonLabel = 'Entregar pedido';

  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Flex flexDir="column">
                <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
                  {t('Pedido Nº')} {order?.code}
                </Text>
                {order?.status === 'canceled' && (
                  <Text fontSize="md" color="red" fontWeight="700" lineHeight="22px">
                    {t('Pedido cancelado pelo')} <Text as="span">{cancellator}</Text>
                  </Text>
                )}
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Nome do cliente:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {order?.consumer?.name ?? 'N/E'}
                  </Text>
                </Text>
                {/*<Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Nº de pedidos no restaurante:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {0}
                  </Text>
                  <Pendency />
                </Text>*/}
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Horário do pedido:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {orderConfirmedTimestamp ? getDateAndHour(orderConfirmedTimestamp) : 'N/E'}
                  </Text>
                </Text>
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Status:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {
                      //@ts-ignore
                      order?.status ? orderStatusPTOptions[order?.status] : 'N/E'
                    }
                  </Text>
                </Text>
              </Flex>
              <Flex flexDir="column">
                <CustomButton
                  label="Abrir chat com o cliente"
                  link={`/app/orders/chat/${order?.id}/${order?.consumer?.id}`}
                  size="md"
                  variant="outline"
                />
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody pb="28" ref={bodyRef}>
            {children}
          </DrawerBody>
          {!isCanceling && !orderDispatched && order?.status !== 'canceled' && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <Flex w="full" justifyContent="flex-start">
                <Flex
                  w="full"
                  maxW="607px"
                  flexDir="row"
                  justifyContent={order?.status === 'confirmed' ? 'space-between' : 'flex-end'}
                >
                  {/*<Button width="full" maxW="200px" variant="dangerLight" onClick={cancel}>
                    {t('Cancelar pedido')}
                    </Button>*/}
                  {order?.status === 'confirmed' && (
                    <Box color="black" fontSize="xs">
                      <Text>{t('Tempo de preparo do pedido:')}</Text>
                      <Text fontWeight="700">
                        {t(`${order?.cookingTime ? order?.cookingTime / 60 : 'N/I'} minutos`)}
                        <Text
                          ml="2"
                          as="span"
                          color="#4EA031"
                          textDecor="underline"
                          cursor="pointer"
                          onClick={scrollBodyToBottom}
                        >
                          {t('Alterar')}
                        </Text>
                      </Text>
                    </Box>
                  )}
                  {order?.status === 'confirmed' ? (
                    <OrderAcceptButton key={Math.random()} onClick={PrimaryButtonFunction}>
                      {t('CONFIRMAR')}
                    </OrderAcceptButton>
                  ) : (
                    <Button
                      isDisabled={!PrimaryButtonAble}
                      type="submit"
                      width="full"
                      maxW="200px"
                      onClick={PrimaryButtonFunction}
                      //fontSize={order?.status === 'confirmed' ? '20px' : '15px'}
                    >
                      {t(PrimaryButtonLabel)}
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
