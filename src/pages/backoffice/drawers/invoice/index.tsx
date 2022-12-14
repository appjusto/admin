import { IuguCustomerPaymentMethod } from '@appjusto/types/payment/iugu';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Text,
} from '@chakra-ui/react';
import { useConsumerProfile } from 'app/api/consumer/useConsumerProfile';
import { useObserveInvoice } from 'app/api/invoices/useObserveInvoice';
import { CustomButton } from 'common/components/buttons/CustomButton';
import {
  invoiceStatusPTOptions,
  invoiceTypePTOptions,
} from 'pages/backoffice/utils';
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';
import { PaymentMethodCard } from '../consumer/PaymentMethods';
import { SectionTitle } from '../generics/SectionTitle';
import { getAccountBtnLabel, getAccountBtnLink } from './utils';

interface BaseDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  invoiceId: string;
};

const InvoiceDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { invoiceId } = useParams<Params>();
  const invoice = useObserveInvoice(invoiceId);
  const consumer = useConsumerProfile(invoice?.consumerId);
  // state
  const [paymentMethod, setPaymentMethod] = React.useState<
    IuguCustomerPaymentMethod | string | null
  >();
  // helpers
  // label={t(
  //   `Ver ${
  //     invoice?.invoiceType === 'delivery' ||
  //     invoice?.invoiceType === 'tip'
  //       ? 'entregador'
  //       : 'restaurante'
  //   }`
  // )}
  const accountBtnLabel = getAccountBtnLabel(invoice);
  const accountBtnLink = getAccountBtnLink(invoice);
  // link={`/backoffice/${
  //   invoice?.invoiceType === 'delivery' ||
  //   invoice?.invoiceType === 'tip'
  //     ? 'couriers'
  //     : 'businesses'
  // }/${invoice?.accountId}`}
  // side effects
  React.useEffect(() => {
    if (invoice?.paymentMethod && invoice?.paymentMethod !== 'credit_card') {
      setPaymentMethod(invoice.paymentMethod.toUpperCase());
      return;
    }
    if (!invoice?.customerPaymentMethodId) return;
    if (!consumer?.paymentChannel?.methods) return;
    const method = consumer.paymentChannel.methods.find(
      (method) => method.id === invoice?.customerPaymentMethodId
    );
    if (method) setPaymentMethod(method);
    else setPaymentMethod(null);
  }, [
    invoice?.paymentMethod,
    invoice?.customerPaymentMethodId,
    consumer?.paymentChannel?.methods,
  ]);
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
              {t('Fatura')}
            </Text>
          </DrawerHeader>
          <DrawerBody pb="28">
            <Text
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('ID da fatura:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.externalId ?? 'N/E'}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('ID do pedido:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.orderCode ?? 'N/E'}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('ID do consumidor:')}{' '}
              <Link
                as={RouterLink}
                to={`/backoffice/consumers/${invoice?.consumerId}`}
                fontWeight="500"
                textDecor="underline"
              >
                {invoice?.consumerId ?? 'N/E'}
              </Link>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Data:')}{' '}
              <Text as="span" fontWeight="500">
                {getDateAndHour(invoice?.createdOn)}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Tipo:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.invoiceType
                  ? invoiceTypePTOptions[invoice.invoiceType]
                  : 'N/E'}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Status:')}{' '}
              <Text as="span" fontWeight="500">
                {invoice?.status
                  ? invoiceStatusPTOptions[invoice.status]
                  : 'N/E'}
              </Text>
            </Text>
            {invoice?.error && (
              <Box>
                <Text
                  mt="2"
                  fontSize="15px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Erro:')}
                </Text>
                <Text
                  ml="4"
                  fontSize="13px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('LR:')}{' '}
                  <Text as="span" fontWeight="500">
                    {invoice.error.LR ?? 'N/E'}
                  </Text>
                </Text>
                <Text
                  ml="4"
                  fontSize="13px"
                  color="black"
                  fontWeight="700"
                  lineHeight="22px"
                >
                  {t('Mensagem:')}{' '}
                  <Text as="span" fontWeight="500">
                    {invoice.error.message ?? 'N/E'}
                  </Text>
                </Text>
              </Box>
            )}
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
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
            <SectionTitle>{t('Método de pagamento')}</SectionTitle>
            {paymentMethod === undefined ? (
              <Text>{t('Carregando método de pagamento...')}</Text>
            ) : paymentMethod === null ? (
              <Text>
                {t(
                  `Método de pagamento com ID: ${
                    invoice?.customerPaymentMethodId ?? 'N/E'
                  } não encontrado`
                )}
              </Text>
            ) : (
              <PaymentMethodCard method={paymentMethod} />
            )}
            {invoice?.invoiceType !== 'p2p' && (
              <>
                <SectionTitle>{t('Subconta')}</SectionTitle>
                {invoice?.accountType === 'platform' ? (
                  <Text
                    mt="2"
                    fontSize="15px"
                    color="black"
                    fontWeight="700"
                    lineHeight="22px"
                  >
                    {t('Nome:')}{' '}
                    <Text as="span" fontWeight="500">
                      {'Appjusto (Logística fora da rede)'}
                    </Text>
                  </Text>
                ) : (
                  <>
                    <Text
                      mt="2"
                      fontSize="15px"
                      color="black"
                      fontWeight="700"
                      lineHeight="22px"
                    >
                      {t('Nome:')}{' '}
                      <Text as="span" fontWeight="500">
                        {invoice?.accountName ?? 'N/E'}
                      </Text>
                    </Text>
                    <Text
                      mt="2"
                      fontSize="15px"
                      color="black"
                      fontWeight="700"
                      lineHeight="22px"
                    >
                      {t('ID:')}{' '}
                      <Text as="span" fontWeight="500">
                        {invoice?.accountExternalId ?? 'N/E'}
                      </Text>
                    </Text>
                    <Box mt="4">
                      {accountBtnLabel && (
                        <CustomButton
                          mt="0"
                          minW="220px"
                          color="black"
                          variant="outline"
                          label={accountBtnLabel}
                          link={accountBtnLink}
                          size="sm"
                        />
                      )}
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

export default InvoiceDrawer;
