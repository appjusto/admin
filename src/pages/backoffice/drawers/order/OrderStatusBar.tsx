import { Box, Flex, Radio, RadioGroup, Textarea } from '@chakra-ui/react';
import { IssueType, OrderStatus } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';

interface OrderStatusProps {
  status?: OrderStatus;
  issue?: IssueType;
  message?: string;
  updateState(type: string, value: OrderStatus | IssueType | string): void;
}

export const OrderStatusBar = ({ status, issue, message, updateState }: OrderStatusProps) => {
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
      <SectionTitle>{t('Motivo do cancelamento:')}</SectionTitle>
      <RadioGroup
        mt="2"
        onChange={(value: IssueType) => updateState('issue', value)}
        value={issue}
        defaultValue="1"
        colorScheme="green"
        color="black"
        fontSize="15px"
        lineHeight="21px"
      >
        <Flex flexDir="column" justifyContent="flex-start">
          <Radio mt="2" value="consumer-cancel">
            {t('Solicitado por cliente')}
          </Radio>
          <Radio mt="2" value="courier-cancel">
            {t('Solicitado por entregador')}
          </Radio>
          <Radio mt="2" value="restaurant-cancel">
            {t('Solicitado por restaurante')}
          </Radio>
        </Flex>
      </RadioGroup>
      <SectionTitle>{t('Mensagem personalizada:')}</SectionTitle>
      <Textarea mt="2" value={message} onChange={(ev) => updateState('message', ev.target.value)} />
    </Box>
  );
};
