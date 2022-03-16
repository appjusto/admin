import {
  DispatchingState,
  InvoiceType,
  Issue,
  IssueType,
  OrderStatus,
  OrderType,
} from '@appjusto/types';
import { Box, Flex, HStack, RadioGroup, Text, Textarea } from '@chakra-ui/react';
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
  dispatchingState?: DispatchingState;
  issue?: Issue | null;
  message?: string;
  cancelOptions?: Issue[] | null;
  refund: InvoiceType[];
  refundValue: number;
  onRefundingChange(type: InvoiceType, value: boolean): void;
  updateState(type: string, value: OrderStatus | DispatchingState | IssueType | string): void;
}

export const OrderStatusBar = ({
  orderType,
  orderStatus,
  status,
  dispatchingState,
  issue,
  message,
  cancelOptions,
  refund,
  refundValue,
  onRefundingChange,
  updateState,
}: OrderStatusProps) => {
  // helpers
  const isOrderActive = orderStatus
    ? ['preparing', 'ready', 'dispatching'].includes(orderStatus)
    : false;
  const cancelator = getOrderCancellator(issue?.type);
  // UI
  return (
    <Box>
      <Flex flexDir="row" justifyContent="space-between" px="4">
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
              <CustomRadio mt="2" value="confirmed">
                {t('Confirmado')}
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
              <CustomRadio mt="2" value="rejected">
                {t('Rejeitado')}
              </CustomRadio>
              <CustomRadio mt="2" value="canceled">
                {t('Cancelado')}
              </CustomRadio>
            </Flex>
          </RadioGroup>
        </Box>
        {isOrderActive && (
          <Box>
            <SectionTitle mt="0">{t('Alterar status da entrega:')}</SectionTitle>
            <RadioGroup
              mt="2"
              onChange={(value: DispatchingState) => updateState('dispatchingState', value)}
              value={dispatchingState}
              colorScheme="green"
              color="black"
              fontSize="15px"
              lineHeight="21px"
            >
              <Flex flexDir="column" justifyContent="flex-start">
                <CustomRadio mt="2" value="going-pickup">
                  {t('Entreg. a caminho da retirada')}
                </CustomRadio>
                <CustomRadio mt="2" value="arrived-pickup">
                  {t('Entreg. no local da retirada')}
                </CustomRadio>
                <CustomRadio mt="2" value="going-destination">
                  {t('Entreg. a caminho da entrega')}
                </CustomRadio>
                <CustomRadio mt="2" value="arrived-destination">
                  {t('Entreg. no local da entrega')}
                </CustomRadio>
              </Flex>
            </RadioGroup>
          </Box>
        )}
      </Flex>
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
        </>
      )}
      <SectionTitle>{t('Comentário:')}</SectionTitle>
      <Textarea mt="2" value={message} onChange={(ev) => updateState('message', ev.target.value)} />
    </Box>
  );
};
