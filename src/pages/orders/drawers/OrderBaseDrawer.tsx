import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
import { OrderStatus } from 'appjusto-types';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { Pendency } from './orderdrawer';

interface BaseDrawerProps {
  orderId: string;
  orderSeq: string;
  orderStatus: OrderStatus;
  isCurrierArrived: boolean;
  client: string;
  clientOrders: number;
  isOpen: boolean;
  cancel(): void;
  isCanceling: boolean;
  isError: boolean;
  error: unknown | string | null;
  onClose(): void;
  children: React.ReactNode;
}

export const OrderBaseDrawer = ({
  orderId,
  orderSeq,
  orderStatus,
  isCurrierArrived,
  client,
  clientOrders,
  cancel,
  isCanceling,
  isError,
  error,
  onClose,
  children,
  ...props
}: BaseDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { changeOrderStatus } = useOrdersContext();

  //handlers
  const PrimaryButtonFunction = () => {
    if (orderStatus === 'confirming') changeOrderStatus(orderId, 'preparing');
    if (orderStatus === 'preparing') changeOrderStatus(orderId, 'ready');
    if (orderStatus === 'ready') changeOrderStatus(orderId, 'dispatching');
    onClose();
  };

  //UI conditions
  let orderDispatched = ['dispatching', 'delivered'].includes(orderStatus);

  let PrimaryButtonAble =
    ['confirming', 'preparing'].includes(orderStatus) ||
    (orderStatus === 'ready' && isCurrierArrived);

  let PrimaryButtonLabel = 'Preparar pedido';
  if (orderStatus === 'preparing') PrimaryButtonLabel = 'Pedido pronto';
  if (orderStatus === 'ready') PrimaryButtonLabel = 'Entregar pedido';

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
                  {t('Pedido Nº')} {orderSeq}
                </Text>
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Nome do cliente:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {client}
                    <Pendency />
                  </Text>
                </Text>
                <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
                  {t('Nº de pedidos no restaurante:')}{' '}
                  <Text as="span" color="black" fontWeight="700">
                    {clientOrders}
                  </Text>
                  <Pendency />
                </Text>
              </Flex>
              <Flex flexDir="column">
                <CustomButton
                  label="Abrir chat com o cliente"
                  link={`/app/orders`}
                  size="md"
                  variant="outline"
                />
              </Flex>
            </Flex>
          </DrawerHeader>
          <DrawerBody pb="28">
            {children}
            {isError && (
              <Box mt="6">
                {isError && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>{t('Erro!')}</AlertTitle>
                    <AlertDescription>
                      {getErrorMessage(error) ?? t('Tenta de novo?')}
                    </AlertDescription>
                  </Alert>
                )}
              </Box>
            )}
          </DrawerBody>
          {!isCanceling && !orderDispatched && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <Flex w="full" justifyContent="flex-start">
                <Flex w="full" maxW="607px" flexDir="row" justifyContent="space-between">
                  <Button width="full" maxW="200px" variant="dangerLight" onClick={cancel}>
                    {t('Cancelar pedido')}
                  </Button>
                  <Button
                    isDisabled={!PrimaryButtonAble}
                    type="submit"
                    width="full"
                    maxW="200px"
                    onClick={PrimaryButtonFunction}
                  >
                    {t(PrimaryButtonLabel)}
                  </Button>
                </Flex>
              </Flex>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
