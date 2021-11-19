import { Box, Flex, HStack, RadioGroup, Text, Textarea } from '@chakra-ui/react';
import { InvoiceType, Issue, IssueType, OrderStatus, OrderType } from 'appjusto-types';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import CustomRadio from 'common/components/form/CustomRadio';
import React from 'react';
import { formatCurrency } from 'utils/formatters';
import { getOrderCancellator } from 'utils/functions';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface OrderStatusProps {
  orderType?: OrderType;
  orderStatus?: OrderStatus;
  status?: OrderStatus;
  issue?: Issue | null;
  message?: string;
  cancelOptions?: Issue[] | null;
  refund: InvoiceType[];
  refundValue: number;
  onRefundingChange(type: InvoiceType, value: boolean): void;
  updateState(type: string, value: OrderStatus | IssueType | string): void;
}

export const OrderStatusBar = ({
  orderType,
  orderStatus,
  status,
  issue,
  message,
  cancelOptions,
  refund,
  refundValue,
  onRefundingChange,
  updateState,
}: OrderStatusProps) => {
  // helpers
  const cancelator = getOrderCancellator(issue?.type);
  // UI
  return (
    <Box>
      <SectionTitle mt="0">{t('Alterar status do pedido:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: OrderStatus) => updateState('status', value)}
        value={status}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <CustomRadio mt="2" value="confirming">
            {t('Aguardando confirmação')}
          </CustomRadio>
          {orderType === 'food' && (
            <>
              <CustomRadio mt="2" value="preparing">
                {t('Em preparo')}
              </CustomRadio>
              <CustomRadio mt="2" value="ready">
                {t('Pronto - aguardando entregador')}
              </CustomRadio>
            </>
          )}
          <CustomRadio mt="2" value="dispatching">
            {t('A caminho da entrega')}
          </CustomRadio>
          <CustomRadio mt="2" value="delivered">
            {t('Entregue')}
          </CustomRadio>
          <CustomRadio mt="2" value="canceled">
            {t('Cancelado')}
          </CustomRadio>
        </Flex>
      </RadioGroup>
      {status === 'canceled' && (
        <>
          <SectionTitle>{t('Dados do cancelamento:')}</SectionTitle>
          {orderStatus === 'canceled' ? (
            <>
              <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Cancelado por:')}{' '}
                <Text as="span" fontWeight="500">
                  {cancelator}
                </Text>
              </Text>
              <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Motivo informado:')}{' '}
                <Text as="span" fontWeight="500">
                  {issue?.title ?? 'N/I'}
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
                {t('Informe quem está solicitando este cancelamento:')}
              </Text>
              <RadioGroup
                mt="2"
                onChange={(value: string) => updateState('issue', value)}
                value={issue?.id}
                defaultValue="1"
                colorScheme="green"
                color="black"
                fontSize="15px"
                lineHeight="21px"
              >
                <Flex flexDir="column" justifyContent="flex-start">
                  {cancelOptions?.map((option) => (
                    <CustomRadio key={option.id} mt="2" value={option.id}>
                      {option.title}
                    </CustomRadio>
                  ))}
                </Flex>
              </RadioGroup>
            </>
          )}
          <SectionTitle>{t('Reembolso:')}</SectionTitle>
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {t(`Valor do reembolso: ${formatCurrency(refundValue)}`)}
          </Text>
          <HStack mt="4" spacing={4}>
            <CustomCheckbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('platform')}
              onChange={(e) => onRefundingChange('platform', e.target.checked)}
            >
              {t('Plataforma')}
            </CustomCheckbox>
            <CustomCheckbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('products')}
              onChange={(e) => onRefundingChange('products', e.target.checked)}
            >
              {t('Produtos')}
            </CustomCheckbox>
            <CustomCheckbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('delivery')}
              onChange={(e) => onRefundingChange('delivery', e.target.checked)}
            >
              {t('Entrega')}
            </CustomCheckbox>
          </HStack>
          <SectionTitle>{t('Comentário:')}</SectionTitle>
          <Textarea
            mt="2"
            value={message}
            onChange={(ev) => updateState('message', ev.target.value)}
          />
        </>
      )}
    </Box>
  );
};
