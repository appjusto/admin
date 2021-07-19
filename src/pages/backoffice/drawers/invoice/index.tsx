import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from '@chakra-ui/react';
import { useObserveInvoice } from 'app/api/order/useObserveInvoice';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { invoiceStatusPTOptions, invoiceTypePTOptions } from 'pages/backoffice/utils';
import React from 'react';
import { useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  invoiceId: string;
};

export const InvoiceDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { invoiceId } = useParams<Params>();
  const invoice = useObserveInvoice(invoiceId);
  //UI
  return (
    <Drawer placement="right" size="lg" onClose={onClose} {...props}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton bg="green.500" mr="12px" _focus={{ outline: 'none' }} />
          <DrawerHeader pb="2">
            <Text color="black" fontSize="2xl" fontWeight="700" lineHeight="28px" mb="2">
              {t('Fatura')}
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Text fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('ID da fatura:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.externalId ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('ID do pedido:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.orderCode ?? 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Data:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(invoice?.createdOn)}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Tipo:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.invoiceType ? invoiceTypePTOptions[invoice.invoiceType] : 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.status ? invoiceStatusPTOptions[invoice.status] : 'N/E'}
              </Text>
            </Text>
            <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
              {t('Valor:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.value ? formatCurrency(invoice?.value) : 'N/E'}
              </Text>
            </Text>
            <Box mt="4">
              <CustomButton
                mt="0"
                minW="220px"
                variant="outline"
                color="black"
                label={t('Ver pedido')}
                link={`/backoffice/orders/${invoice?.orderId}`}
                size="sm"
              />
            </Box>
            {invoice?.invoiceType !== 'platform' && (
              <>
                <SectionTitle>{t('Subconta')}</SectionTitle>
                {invoice?.accountType === 'platform' ? (
                  <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                    {t('Nome:')}{' '}
                    <Text as="span" fontWeight="500">
                      {'Appjusto (Logística fora da rede)'}
                    </Text>
                  </Text>
                ) : (
                  <>
                    <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                      {t('Nome:')}{' '}
                      <Text as="span" fontWeight="500">
                        {invoice?.accountName ?? 'N/E'}
                      </Text>
                    </Text>
                    <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                      {t('ID:')}{' '}
                      <Text as="span" fontWeight="500">
                        {invoice?.accountExternalId ?? 'N/E'}
                      </Text>
                    </Text>
                    <Box mt="4">
                      <CustomButton
                        mt="0"
                        minW="220px"
                        color="black"
                        variant="outline"
                        label={t(
                          `Ver ${
                            invoice?.invoiceType === 'delivery' || invoice?.invoiceType === 'tip'
                              ? 'entregador'
                              : 'restaurante'
                          }`
                        )}
                        link={`/backoffice/${
                          invoice?.invoiceType === 'delivery' || invoice?.invoiceType === 'tip'
                            ? 'couriers'
                            : 'businesses'
                        }/${invoice?.accountId}`}
                        size="sm"
                      />
                    </Box>
                  </>
                )}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
