import { Box, Stack } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
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
import { ManagerBaseDrawer } from '../drawers/manager/ManagerBaseDrawer';
import { BackofficeOrderDrawer } from '../drawers/order';
import { UserChangeDrawer } from '../drawers/profile-changes/UserChangeDrawer';
import { BOChatDrawer } from './BOChatDrawer';
import { BOList } from './BOList';
// import { StaffFilterOptions } from './StaffFilter';

const BODashboard = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { path } = useRouteMatch();
  const history = useHistory();
  const {
    // activeOrders,
    unsafeOrders,
    matchingIssueOrders,
    issueOrders,
    watchedOrders,
    businesses,
    userChanges,
    // fetchNextActiveOrders,
    fetchNextUnsafeOrders,
    fetchNextMatchingIssueOrders,
    fetchNextIssueOrders,
    fetchNextBusiness,
    fetchNextChanges,
  } = useContextBackofficeDashboard();
  // state
  const [dateTime, setDateTime] = React.useState('');
  // helpers
  const userCanUpdateBusiness = userAbility?.can('read', 'businesses');
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // side effects
  React.useEffect(() => {
    document.title = 'AppJusto | Backoffice';
  }, []);
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <>
      <PageHeader
        title={t('Visão geral')}
        subtitle={t(`Atualizado ${dateTime}`)}
        showVersion
      />
      <DirectAccessById />
      <Box mt="4">
        {watchedOrders.length > 0 && (
          <BOList
            display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
            title={t('Meus pedidos')}
            data={watchedOrders}
            dataLength={watchedOrders.length}
            listType="orders-watched"
          />
        )}
      </Box>
      <Stack
        mt="4"
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
      >
        <BOList
          display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
          title={t('Pedidos para triagem')}
          data={unsafeOrders}
          dataLength={unsafeOrders.length}
          listType="orders-unsafe"
          details={t(
            'Aqui ficarão listados todos os pedidos em andamento que precisam de triagem.'
          )}
          infiniteScroll
          scrollTopLimit={750}
          loadData={fetchNextUnsafeOrders}
        />
        <BOList
          display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
          title={t('Pedidos com problemas no matching')}
          data={matchingIssueOrders}
          dataLength={unsafeOrders.length}
          listType="orders-matching"
          details={t(
            'Aqui ficarão listados todos os pedidos em andamento com atraso no matching.'
          )}
          infiniteScroll
          scrollTopLimit={750}
          loadData={fetchNextMatchingIssueOrders}
        />
        <BOList
          display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
          title={t('Pedidos com problemas reportados')}
          data={issueOrders}
          dataLength={issueOrders.length}
          listType="orders-issue"
          details={t(
            'Aqui ficarão listados todos os pedidos em andamento com problemas reportados.'
          )}
          infiniteScroll
          scrollTopLimit={750}
          loadData={fetchNextIssueOrders}
        />
      </Stack>
      <Stack
        mt="4"
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={userCanUpdateBusiness ? 4 : 0}
      >
        <BOList
          display={userCanUpdateBusiness ? 'flex' : 'none'}
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
        <Route path={`${path}/manager/:managerId`}>
          <ManagerBaseDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/chat/:orderId/:type`}>
          <BOChatDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default BODashboard;
