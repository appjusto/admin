import { Stack } from '@chakra-ui/react';
import { useBusinesses } from 'app/api/business/useBusinesses';
import { Business, Order, WithId } from 'appjusto-types';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BOList } from './BOList';
import { Panel } from './Panel';

const options = { active: true, inactive: true };

const BODashboard = () => {
  // context
  const businesses = useBusinesses(options);
  //const { orders } = useBOOrdersContext();
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
          data={businesses as WithId<Business>[]}
          listType="business"
        />
        <BOList title={t('Pedidos em andamento')} data={[] as WithId<Order>[]} listType="orders" />
      </Stack>
    </>
  );
};

export default BODashboard;
