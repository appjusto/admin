import { Stack } from '@chakra-ui/react';
import { useBusinesses } from 'app/api/business/useBusinesses';
import { useObserveOrders } from 'app/api/order/useObserveOrders';
import {
  ProfileChangesSituations,
  useObserveUsersChanges,
} from 'app/api/users/useObserveUsersChanges';
import { OrderStatus } from 'appjusto-types';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BusinessDrawer } from '../drawers/business';
import { BackofficeOrderDrawer } from '../drawers/order';
import { UserChangeDrawer } from '../drawers/profile-changes/UserChangeDrawer';
import { BOList } from './BOList';
import { Panel } from './Panel';

const businessSituations = ['submitted', 'verified', 'invalid'];

const usersChangesSituations = ['pending'] as ProfileChangesSituations[];

const statuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

const BODashboard = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const businesses = useBusinesses(businessSituations);
  const orders = useObserveOrders(statuses);
  const changes = useObserveUsersChanges(usersChangesSituations);
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
        />
        <BOList
          title={t('Solicitações de alteração de perfil')}
          data={changes}
          listType="profile-changes"
          details={t(
            'Aqui ficarão listados todas as solicitações de alteração de perfil aguardando aprovação.'
          )}
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
      </Switch>
    </>
  );
};

export default BODashboard;
