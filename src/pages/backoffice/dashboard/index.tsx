import { Stack } from '@chakra-ui/react';
import { useBusinesses } from 'app/api/business/useBusinesses';
import { useBackofficeOrders } from 'app/api/order/useBackofficeOrders';
import { OrderStatus } from 'appjusto-types';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BOList } from './BOList';
import { Panel } from './Panel';

const situations = ['submitted', 'verified', 'invalid'];

const statuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

const BODashboard = () => {
  // context
  const businesses = useBusinesses(situations);
  const orders = useBackofficeOrders(statuses);
  // state
  const [dateTime, setDateTime] = React.useState('');

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  // UI
  return (
    <>
      <PageHeader title={t('Visão geral')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Panel />
      <Stack mt="4" w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
        <BOList
          title={t('Restaurantes - Aguardando aprovação')}
          data={businesses}
          listType="business"
        />
        <BOList title={t('Pedidos em andamento')} data={orders} listType="orders" />
      </Stack>
    </>
  );
};

export default BODashboard;
