import { Stack } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { OrdersKanbanList } from './OrdersKanbanList';

export const OrdersKanban = () => {
  return (
    <Stack direction={['column', 'column', 'row']} mt="16" spacing="4">
      <OrdersKanbanList title={t('Não confirmados')} orders={[]} />
      <OrdersKanbanList title={t('Em preparação')} orders={[]} />
      <OrdersKanbanList title={t('Aguardando retirada')} orders={[]} />
      <OrdersKanbanList title={t('À caminho')} orders={[]} />
    </Stack>
  );
};
