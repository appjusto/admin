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

interface BaseDrawerProps {
  type: string;
  order: string;
  client: string;
  clientOrders: number;
  isOpen: boolean;
  accept(): void;
  cancel(): void;
  isCanceling: boolean;
  isError: boolean;
  error: unknown | string | null;
  onClose(): void;
  children: React.ReactNode;
}

export const OrderBaseDrawer = ({
  type,
  order,
  client,
  clientOrders,
  accept,
  cancel,
  isCanceling,
  isError,
  error,
  onClose,
  children,
  ...props
}: BaseDrawerProps) => {
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {t('Pedido Nº')} {order}
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
              <Flex w="full" flexDir="row" justifyContent="space-between">
                <Button width="full" maxW="200px" variant="dangerLight" onClick={cancel}>
                  {t('Cancelar pedido')}
                </Button>
                <Button type="submit" width="full" maxW="200px" onClick={accept}>
                  {t('Preparar pedido')}
                </Button>
              </Flex>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
