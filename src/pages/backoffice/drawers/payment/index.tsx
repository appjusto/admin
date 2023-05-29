import { IuguPayment } from '@appjusto/types';
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
import { useObservePayment } from 'app/api/payments/useObservePayment';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { invoiceStatusPTOptions } from 'pages/backoffice/utils';
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
  paymentId: string;
};

const PaymentDrawer = ({ onClose, ...props }: BaseDrawerProps) => {
  //context
  const { paymentId } = useParams<Params>();
  const payment = useObservePayment(paymentId);
  // const consumer = useConsumerProfile(payment?.from.accountId);
  // state
  const [paymentMethod, setPaymentMethod] = React.useState<
    IuguCustomerPaymentMethod | string | null
  >();
  // helpers
  const accountBtnLabel = getAccountBtnLabel(payment);
  const accountBtnLink = getAccountBtnLink(payment);
  // side effects
  React.useEffect(() => {
    if (payment?.method && payment?.method !== 'credit_card') {
      setPaymentMethod(payment.method.toUpperCase());
      return;
    }
    // if (!payment?.customerPaymentMethodId) return;
    // get from new collection card
    // type => Card => IuguCard
    // if (!consumer?.paymentChannel?.methods) return;

    // if (payment?.processor === 'iugu' && payment?.method === 'credit_card') {
    //   const iuguPayment = payment as IuguPayment;
    //   const method = consumer.paymentChannel.methods.find(
    //     (method) => method.id === iuguPayment.cardTokenId
    //   );
    //   if (method) setPaymentMethod(method);
    //   else setPaymentMethod(null);
    // }
  }, [payment?.method]);
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
                {payment?.externalId ?? 'N/E'}
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
                {payment?.order.code ?? 'N/E'}
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
                to={`/backoffice/consumers/${payment?.from.accountId}`}
                fontWeight="500"
                textDecor="underline"
              >
                {payment?.from.accountId ?? 'N/E'}
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
                {getDateAndHour(payment?.createdAt)}
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
                {'N/A'}
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
                {payment?.status
                  ? invoiceStatusPTOptions[payment.status]
                  : 'N/E'}
              </Text>
            </Text>
            {payment?.error && (
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
                    {payment?.error?.details?.LR ?? 'N/E'}
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
                    {payment?.error.message ?? 'N/E'}
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
                {payment?.value ? formatCurrency(payment?.value) : 'N/E'}
              </Text>
            </Text>
            <Text
              mt="2"
              fontSize="15px"
              color="black"
              fontWeight="700"
              lineHeight="22px"
            >
              {t('Pago:')}{' '}
              <Text as="span" fontWeight="500">
                {payment?.paid !== undefined
                  ? formatCurrency(payment.paid)
                  : 'N/E'}
              </Text>
            </Text>
            <Box mt="4">
              <CustomButton
                mt="0"
                minW="220px"
                variant="outline"
                color="black"
                label={t('Ver pedido')}
                link={`/backoffice/orders/${payment?.order.id}`}
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
                    (payment as IuguPayment).cardTokenId ?? 'N/E'
                  } não encontrado`
                )}
              </Text>
            ) : (
              <PaymentMethodCard method={paymentMethod} />
            )}
            {payment?.order.type !== 'p2p' && (
              <>
                <SectionTitle>{t('Subconta')}</SectionTitle>
                {payment?.from.accountType === 'platform' ? (
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
                        {payment?.to.accountName ?? 'N/E'}
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

export default PaymentDrawer;
