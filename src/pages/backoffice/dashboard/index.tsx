import { Box, Stack } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBackofficeDashboard } from 'app/state/dashboards/backoffice';
import { DirectAccessById } from 'common/components/backoffice/DirectAccessById';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { SectionTitle } from '../drawers/generics/SectionTitle';
import { BackofficeOrderDrawer } from '../drawers/order';
import { BOChatDrawer } from './BOChatDrawer';
import { BOList } from './BOList';
import { PlatformVersions } from './PlatformVersions';
import { FilterOptions } from './StaffFilter';
// import { StaffFilterOptions } from './StaffFilter';

const ManagerBaseDrawer = React.lazy(
  () =>
    import(/* webpackPrefetch: true */ '../drawers/manager/ManagerBaseDrawer')
);
const BusinessDrawer = React.lazy(
  () => import(/* webpackPrefetch: true */ '../drawers/business')
);
const ConsumerDrawer = React.lazy(
  () => import(/* webpackPrefetch: true */ '../drawers/consumer')
);
const CourierDrawer = React.lazy(
  () => import(/* webpackPrefetch: true */ '../drawers/courier')
);
const InvoiceDrawer = React.lazy(
  () => import(/* webpackPrefetch: true */ '../drawers/invoice')
);
const PaymentDrawer = React.lazy(
  () => import(/* webpackPrefetch: true */ '../drawers/payment')
);
const UserChangeDrawer = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true */ '../drawers/profile-changes/UserChangeDrawer'
    )
);

const warningOrdersFilterOptions = [
  { label: 'Demora no aceite', value: 'waiting-confirmation' },
  { label: 'Demora no matching', value: 'matching' },
  { label: 'Demora na coleta', value: 'pick-up' },
  { label: 'Demora na entrega', value: 'delivering' },
] as FilterOptions;

const BODashboard = () => {
  // context
  const { userAbility } = useContextFirebaseUser();
  const { path } = useRouteMatch();
  const history = useHistory();
  const {
    platformAccess,
    // activeOrders,
    unsafeOrders,
    warningOrders,
    issueOrders,
    watchedOrders,
    userChanges,
    autoFlags,
    // fetchNextActiveOrders,
    handleWarningOrdersFilter,
    fetchNextUnsafeOrders,
    fetchNextWarningOrders,
    fetchNextIssueOrders,
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
      <PlatformVersions currentVersions={platformAccess?.currentVersions} />
      <DirectAccessById />
      <SectionTitle>{t('Pedidos em andamento')}</SectionTitle>
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
          title={t('Triagem')}
          data={unsafeOrders}
          dataLength={unsafeOrders.length}
          listType="orders-unsafe"
          details={t(
            'Aqui ficarão listados todos os pedidos em andamento que precisam de triagem.'
          )}
          infiniteScroll
          scrollTopLimit={550}
          loadData={fetchNextUnsafeOrders}
        />
        <BOList
          display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
          title={t('Alerta')}
          data={warningOrders}
          dataLength={warningOrders.length}
          listType="orders-warning"
          details={t(
            'Aqui ficarão listados todos os pedidos em andamento com atraso no aceite ou no matching.'
          )}
          infiniteScroll
          scrollTopLimit={550}
          loadData={fetchNextWarningOrders}
          filterOptions={warningOrdersFilterOptions}
          filterValue={autoFlags}
          handleFilter={handleWarningOrdersFilter}
        />
        <BOList
          display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
          title={t('Problemas')}
          data={issueOrders}
          dataLength={issueOrders.length}
          listType="orders-issue"
          details={t(
            'Aqui ficarão listados todos os pedidos em andamento com problemas reportados.'
          )}
          infiniteScroll
          scrollTopLimit={550}
          loadData={fetchNextIssueOrders}
        />
      </Stack>
      <SectionTitle>{t('Solicitações de alteração de perfil')}</SectionTitle>
      <Box mt="4">
        <BOList
          title={t('Solicitações pendentes')}
          data={userChanges}
          listType="profile-changes"
          details={t(
            'Aqui ficarão listados todas as solicitações de alteração de perfil aguardando aprovação.'
          )}
          infiniteScroll
          loadData={fetchNextChanges}
        />
      </Box>
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
        <Route path={`${path}/payment/:paymentId`}>
          <PaymentDrawer isOpen onClose={closeDrawerHandler} />
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
