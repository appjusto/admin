import { Stack } from '@chakra-ui/react';
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
import { Panel } from './Panel';
// import { StaffFilterOptions } from './StaffFilter';

const BODashboard = () => {
  // context
  const { userAbility, isBackofficeSuperuser } = useContextFirebaseUser();
  const { path } = useRouteMatch();
  const history = useHistory();
  const { activeOrders, watchedOrders, businesses, userChanges, fetchNextActiveOrders, fetchNextBusiness, fetchNextChanges } =
    useContextBackofficeDashboard();
  console.log("watchedOrders", watchedOrders)
  // state
  const [dateTime, setDateTime] = React.useState('');
  // const [listOrders, setListOrders] = React.useState<WithId<Order>[]>([]);
  // const [staffFilter, setStaffFilter] = React.useState<StaffFilterOptions>('all');
  // helpers
  const userCanUpdateBusiness = userAbility?.can('read', 'businesses');
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  // side effects
  React.useEffect(() => {
    document.title = "AppJusto | Backoffice"
  }, [])
  // React.useEffect(() => {
  //   if (staffFilter === 'staff') {
  //     setListOrders(activeOrders.filter((order) => 
  //       typeof order.staff?.id === "string"
  //     ));
  //   } else if (staffFilter === 'none') {
  //     setListOrders(activeOrders.filter((order) => !order.staff));
  //   } else {
  //     setListOrders(activeOrders);
  //   }
  // }, [activeOrders, staffFilter]);
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
          display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
          title={isBackofficeSuperuser ? t('Pedidos em andamento') : t('Novos pedidos')}
          data={activeOrders}
          dataLength={activeOrders.length}
          listType="orders"
          details={t('Aqui ficarão listados todos os pedidos em andamento no momento.')}
          // staffFilter={staffFilter}
          // handleStaffFilter={(value) => setStaffFilter(value)}
          infiniteScroll
          loadData={fetchNextActiveOrders}
        />
        {
          watchedOrders.length > 0 && (
            <BOList
              display={userAbility?.can('read', 'orders') ? 'flex' : 'none'}
              title={t('Meus pedidos')}
              data={watchedOrders}
              dataLength={watchedOrders.length}  
              listType="orders"
              details={t('Aqui ficarão listados todos os pedidos em andamento no momento.')}
              // staffFilter={staffFilter}
              // handleStaffFilter={(value) => setStaffFilter(value)}
            />
          )
        }
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
