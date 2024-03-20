import { Order, OrderStatus, WithId } from '@appjusto/types';
import { Badge, Box, Text } from '@chakra-ui/react';
import { getFoodOrderTotal } from 'pages/backoffice/orders/utils';
import {
  invoiceStatusPTOptions,
  paymentMethodPTOptions,
} from 'pages/backoffice/utils';
import {
  getBusinessDiscount,
  getOrderPaymentChannel,
} from 'pages/orders/utils';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { t } from 'utils/i18n';
import { SectionTitle } from '../../../backoffice/drawers/generics/SectionTitle';

const completedStatuses: OrderStatus[] = ['scheduled', 'delivered', 'canceled'];

interface DetailsProps {
  order?: WithId<Order> | null;
}

export const OrderValues = ({ order }: DetailsProps) => {
  const { path } = useRouteMatch();
  // helpers
  const isBackoffice = path.includes('/backoffice');
  const courierPaid = order?.fare?.courier?.value ?? 0;
  const discount = getBusinessDiscount(order?.fare, order?.coupon);
  const businessPaid = order?.fare?.business?.value ?? 0;
  const generalDiscount = order?.fare?.discount ?? 0;
  const totalPaid = courierPaid + businessPaid - generalDiscount;
  const totalReceived = getFoodOrderTotal(order);
  const consumerCredits = order?.fare?.credits ?? 0;
  const isPaymentPendding =
    getOrderPaymentChannel(order?.paymentMethod) === 'offline';
  const statusColor =
    order?.fare?.business?.status && order?.fare?.business?.status !== 'paid'
      ? 'red'
      : 'black';
  // UI
  return (
    <Box>
      <SectionTitle mt="10">{t('Dados do pagamento')}</SectionTitle>
      {isPaymentPendding ? (
        <Badge bgColor="#FFBE00" borderRadius="md">
          {t('Pagamento na entrega') +
            ' - ' +
            paymentMethodPTOptions[order?.paymentMethod!]}
        </Badge>
      ) : null}
      {order?.fulfillment === 'delivery' && (
        <Text mt="1" fontSize="md">
          {t('Frete:')}{' '}
          <Text as="span" color="black">
            {formatCurrency(courierPaid)}
          </Text>
        </Text>
      )}
      <Text mt="1" fontSize="md">
        {t('Produtos:')}{' '}
        <Text as="span" color="black">
          {businessPaid ? formatCurrency(businessPaid) : 'N/E'}
        </Text>
      </Text>
      {isBackoffice && generalDiscount ? (
        <Text mt="1" fontSize="md">
          {t('Cupom:')}{' '}
          <Text as="span" color="black">
            -{formatCurrency(generalDiscount)}
          </Text>
        </Text>
      ) : null}
      {!isBackoffice && discount ? (
        <Text mt="1" fontSize="md">
          {t('Cupom:')}{' '}
          <Text as="span" color="black">
            -{formatCurrency(discount)}
          </Text>
        </Text>
      ) : null}
      {isBackoffice ? (
        <Text mt="1" fontSize="md">
          {t('Total pago:')}{' '}
          <Text as="span" color="black">
            {formatCurrency(totalPaid)}
          </Text>
          {consumerCredits > 0 ? (
            <Text ml="2" as="span" color="black" fontSize="sm">
              (
              {formatCurrency(consumerCredits) +
                t(' via créditos do consumidor')}
              )
            </Text>
          ) : null}
        </Text>
      ) : (
        <Text mt="1" fontSize="md">
          {t('Total recebido:')}{' '}
          <Text as="span" color="black">
            {formatCurrency(totalReceived)}
          </Text>
          {consumerCredits > 0 ? (
            <Text ml="2" as="span" color="black" fontSize="sm">
              (
              {formatCurrency(consumerCredits) +
                t(' via créditos do consumidor')}
              )
            </Text>
          ) : null}
        </Text>
      )}
      {order?.fare?.business?.status !== undefined && (
        <>
          <Text mt="1" fontSize="md">
            {t('Método de pagamento:')}{' '}
            <Text as="span" color="black">
              {order?.paymentMethod
                ? paymentMethodPTOptions[order.paymentMethod]
                : 'N/E'}
            </Text>
          </Text>
          {completedStatuses.includes(order.status) && (
            <Text mt="1" fontSize="md">
              {t('Status da fatura:')}{' '}
              <Text as="span" color={statusColor} fontWeight="700">
                {order?.fare?.business?.status
                  ? invoiceStatusPTOptions[order.fare.business.status]
                  : 'N/E'}
              </Text>
            </Text>
          )}
        </>
      )}
    </Box>
  );
};
