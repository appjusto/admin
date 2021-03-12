import { useContextBusiness } from 'app/state/business/context';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import SchedulesPage from 'pages/business-schedules/SchedulesPage';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import ManagerProfilePage from 'pages/manager-profile/ManagerProfilePage';
import Menu from 'pages/menu/Menu';
import OrdersHistoryPage from 'pages/orders/history/OrdersHistoryPage';
import Orders from 'pages/orders/OrdersPage';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Dashboard from './Dashboard';

const Home = () => {
  // context
  const business = useContextBusiness();
  const { path } = useRouteMatch();
  // UI
  if (business?.onboarding !== 'completed') {
    return <Redirect to={`/onboarding/${!business?.onboarding ? '' : business.onboarding}`} />;
  }
  return (
    <Switch>
      <Route path={`${path}/orders`} component={Orders} />
      <PageLayout>
        <Route exact path={path} component={Dashboard} />
        <Route path={`${path}/menu`} component={Menu} />
        <Route path={`${path}/business-schedules`} component={SchedulesPage} />
        <Route path={`${path}/delivery-area`} component={DeliveryArea} />
        <Route path={`${path}/business-profile`} component={BusinessProfile} />
        <Route path={`${path}/manager-profile`} component={ManagerProfilePage} />
        <Route path={`${path}/orders-history`} component={OrdersHistoryPage} />
      </PageLayout>
    </Switch>
  );
};

export default Home;
