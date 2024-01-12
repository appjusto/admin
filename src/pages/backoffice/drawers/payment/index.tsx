import { IuguCard, IuguPayment, WithId } from '@appjusto/types';
import { IuguCustomerPaymentMethod } from '@appjusto/types/payment/iugu';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useFetchCardByTokenId } from 'app/api/cards/useFetchCardByTokenId';
import { useObservePayment } from 'app/api/payments/useObservePayment';
import { useUpdatePayment } from 'app/api/payments/useUpdatePayment';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CurrencyInput } from 'common/components/form/input/currency-input/CurrencyInput';
import {
  invoiceStatusPTOptions,
  invoiceTypePTOptions,
} from 'pages/backoffice/utils';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
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
  const { userAbility } = useContextFirebaseUser();
  const { paymentId } = useParams<Params>();
  const payment = useObservePayment(paymentId);
  const { updatePayment, updatePaymentResult } = useUpdatePayment();
  // state
  const [cardTokenId, setCardTokenId] = React.useState<string | null>();
  const consumerCard = useFetchCardByTokenId(cardTokenId);
  const [paymentMethod, setPaymentMethod] = React.useState<
    IuguCustomerPaymentMethod | string | null
  >();
  const [refundValue, setRefundValue] = React.useState(0);
  // helpers
  const accountBtnLabel = getAccountBtnLabel(payment);
  const accountBtnLink = getAccountBtnLink(payment);
  const canRefund =
    userAbility?.can('update', 'payments') &&
    payment?.paid !== undefined &&
    payment?.paid > 0;
  const refundValueInvalid =
    refundValue > (payment?.paid ?? 0) ||
    (payment?.method !== 'credit_card' &&
      refundValue > 0 &&
      refundValue !== payment?.paid);
  const refundDisabled = !refundValue || refundValueInvalid;
  // handlers
  const handleRefund = () => {
    if (refundValueInvalid) return;
    updatePayment({ paymentId, value: refundValue });
  };
  // side effects
  React.useEffect(() => {
    if (!payment) return;
    if (payment?.method && payment?.method !== 'credit_card') {
      setPaymentMethod(payment.method.toUpperCase());
      return;
    }
    const tokenId =
      payment?.processor === 'iugu'
        ? (payment as IuguPayment).cardTokenId ?? null
        : null;
    setCardTokenId(tokenId);
  }, [payment]);
  React.useEffect(() => {
    if (consumerCard === undefined) return;
    if (consumerCard === null) {
      setPaymentMethod(null);
      return;
    }
    setPaymentMethod((consumerCard as WithId<IuguCard>).token);
  }, [payment?.processor, consumerCard]);
  React.useEffect(() => {
    if (!updatePaymentResult.isSuccess) return;
    setRefundValue(0);
  }, [updatePaymentResult.isSuccess]);
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
                {payment?.service
                  ? invoiceTypePTOptions[payment.service]
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
            {payment?.service !== 'p2p' && (
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
                      {'appjusto (Logística fora da rede)'}
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
            {canRefund && (
              <>
                <SectionTitle>{t('Reembolso')}</SectionTitle>
                <Box mt="4">
                  <HStack>
                    <Text>{t('Informe o valor que deseja reembolsar')}</Text>
                    <Tooltip
                      label={t(
                        'Com exceção do cartão de crédito, os demais meios de pagamento só permitem reembolso integral'
                      )}
                    >
                      <Box cursor="pointer">
                        <Icon mt="1" as={MdInfoOutline} />
                      </Box>
                    </Tooltip>
                  </HStack>
                  <HStack mt="2">
                    <CurrencyInput
                      mt="0"
                      id="payment-refund"
                      label={t('Valor reembolsado')}
                      placeholder={t('R$ 0,00')}
                      value={refundValue}
                      onChangeValue={(value) => setRefundValue(value)}
                      maxLength={8}
                      isInvalid={refundValueInvalid}
                    />
                    <Button
                      variant="secondary"
                      h="60px"
                      onClick={handleRefund}
                      isLoading={updatePaymentResult.isLoading}
                      isDisabled={refundDisabled}
                    >
                      {t('Reembolsar')}
                    </Button>
                  </HStack>
                </Box>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default PaymentDrawer;
