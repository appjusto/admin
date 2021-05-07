import { Box, Flex, Radio, RadioGroup, Text, Textarea } from '@chakra-ui/react';
import { Issue, IssueType, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface OrderStatusProps {
  status?: OrderStatus;
  issue?: WithId<Issue> | null;
  message?: string;
  cancelOptions?: WithId<Issue>[] | null;
  updateState(type: string, value: OrderStatus | IssueType | string): void;
}

export const OrderStatusBar = ({
  status,
  issue,
  message,
  cancelOptions,
  updateState,
}: OrderStatusProps) => {
  // state

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
          <Radio mt="2" value="confirmed">
            {t('Confirmado')}
          </Radio>
          <Radio mt="2" value="preparing">
            {t('Em preparo')}
          </Radio>
          <Radio mt="2" value="ready">
            {t('Aguardando entregador')}
          </Radio>
          <Radio mt="2" value="dispatching">
            {t('À caminho da entrega')}
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
          <SectionTitle>{t('Motivo do cancelamento:')}</SectionTitle>
          <Text mt="2" fontSize="15px" color="black" fontWeight="700" lineHeight="22px">
            {t('Informado:')}{' '}
            <Text as="span" fontWeight="500">
              {issue?.title ?? 'N/I'}
            </Text>
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
          <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
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
