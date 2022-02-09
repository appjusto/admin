import { Stack } from '@chakra-ui/react';
import { useContextBackofficeDashboard } from 'app/state/dashboards/backoffice';
import { DirectAccessById } from 'common/components/backoffice/DirectAccessById';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BusinessDrawer } from '../drawers/business';
import { ConsumerDrawer } from '../drawers/consumer';
import { CourierDrawer } from '../drawers/courier';
import { InvoiceDrawer } from '../drawers/invoice';
import { BackofficeOrderDrawer } from '../drawers/order';
import { UserChangeDrawer } from '../drawers/profile-changes/UserChangeDrawer';
import { BOList } from './BOList';
import { Panel } from './Panel';

const BODashboard = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const {
    orders,
    businesses,
    userChanges,
    fetchNextBusiness,
    fetchNextChanges,
  } = useContextBackofficeDashboard();
  // state
  const [dateTime, setDateTime] = React.useState('');
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <>
      <PageHeader title={t('Visão geral')} subtitle={t(`Atualizado ${dateTime}`)} showVersion />
      <Panel />
      <DirectAccessById />
      <Stack mt="4" w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
        <BOList
          title={t('Pedidos em andamento')}
          data={orders}
          listType="orders"
          details={t('Aqui ficarão listados todos os pedidos em andamento no momento.')}
        />
      </Stack>
      <Stack mt="4" w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
        <BOList
          title={t('Restaurantes - Aguardando aprovação')}
          data={businesses}
          listType="businesses"
          details={t(
            'Aqui ficarão listados todos os novos cadastros de restaurantes aguardando aprovação.'
          )}
          infiniteScroll
          loadData={fetchNextBusiness}
        />
        <BOList
          title={t('Solicitações de alteração de perfil')}
          data={userChanges}
          listType="profile-changes"
          details={t(
            'Aqui ficarão listados todas as solicitações de alteração de perfil aguardando aprovação.'
          )}
          infiniteScroll
          loadData={fetchNextChanges}
        />
      </Stack>
      <Switch>
        <Route path={`${path}/business/:businessId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/order/:orderId`}>
          <BackofficeOrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/profile-changes/:changesId`}>
          <UserChangeDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/courier/:courierId`}>
          <CourierDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/consumer/:consumerId`}>
          <ConsumerDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/invoice/:invoiceId`}>
          <InvoiceDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default BODashboard;
