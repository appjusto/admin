import { Box, Checkbox, Flex, HStack, Radio, RadioGroup, Text, Textarea } from '@chakra-ui/react';
import { InvoiceType, Issue, IssueType, OrderStatus, OrderType, WithId } from 'appjusto-types';
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
  cancelOptions?: WithId<Issue>[] | null;
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
          <Radio mt="2" value="confirming">
            {t('Aguardando confirmação')}
          </Radio>
          {orderType === 'food' && (
            <>
              <Radio mt="2" value="preparing">
                {t('Em preparo')}
              </Radio>
              <Radio mt="2" value="ready">
                {t('Pronto - aguardando entregador')}
              </Radio>
            </>
          )}
          <Radio mt="2" value="dispatching">
            {t('A caminho da entrega')}
          </Radio>
          <Radio mt="2" value="delivered">
            {t('Entregue')}
          </Radio>
          <Radio mt="2" value="canceled">
            {t('Cancelado')}
          </Radio>
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
                    <Radio key={option.id} mt="2" value={option.id}>
                      {option.title}
                    </Radio>
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
            <Checkbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('platform')}
              onChange={(e) => onRefundingChange('platform', e.target.checked)}
            >
              {t('Plataforma')}
            </Checkbox>
            <Checkbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('products')}
              onChange={(e) => onRefundingChange('products', e.target.checked)}
            >
              {t('Produtos')}
            </Checkbox>
            <Checkbox
              width="120px"
              colorScheme="green"
              size="lg"
              spacing="1rem"
              iconSize="1rem"
              isChecked={refund.includes('delivery')}
              onChange={(e) => onRefundingChange('delivery', e.target.checked)}
            >
              {t('Entrega')}
            </Checkbox>
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
