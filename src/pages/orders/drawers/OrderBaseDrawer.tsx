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
import { getErrorMessage } from 'core/fb';
import React from 'react';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { Pendency } from './orderdrawer';

interface BaseDrawerProps {
  orderId: string;
  orderCode: string;
  orderStatus: string;
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
  orderCode,
  orderStatus,
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
  const { changeOrderStatus } = useOrdersContext();
  //handlers
  let PrimaryButtonLabel = 'Preparar pedido';
  if (orderStatus === 'preparing') PrimaryButtonLabel = 'Pedido pronto';
  if (orderStatus === 'ready') PrimaryButtonLabel = 'Entregar pedido';

  const PrimaryButtonFunction = () => {
    if (orderStatus === 'confirming') changeOrderStatus(orderId, 'preparing');
    if (orderStatus === 'preparing') changeOrderStatus(orderId, 'ready');
    if (orderStatus === 'ready') changeOrderStatus(orderId, 'dispatching');
    onClose();
  };
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {t('Pedido Nº')} {orderCode}
            </Text>
            <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
              {t('Nome do cliente:')}{' '}
              <Text as="span" color="black" fontWeight="700">
                {client}
              </Text>
            </Text>
            <Text fontSize="md" color="gray.600" fontWeight="500" lineHeight="22px">
              {t('Nº de pedidos no restaurante:')}{' '}
              <Text as="span" color="black" fontWeight="700">
                {clientOrders}
              </Text>
              <Pendency />
            </Text>
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
          {!isCanceling && (
            <DrawerFooter borderTop="1px solid #F2F6EA">
              <Flex w="full" justifyContent="flex-start">
                <Flex w="full" maxW="607px" flexDir="row" justifyContent="space-between">
                  <Button width="full" maxW="200px" variant="dangerLight" onClick={cancel}>
                    {t('Cancelar pedido')}
                  </Button>
                  <Button type="submit" width="full" maxW="200px" onClick={PrimaryButtonFunction}>
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
