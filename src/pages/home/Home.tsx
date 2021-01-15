import { useContextBusiness } from 'app/state/business/context';
import BankingInformation from 'pages/business-profile/BankingInformation';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import Menu from 'pages/menu/Menu';
import Orders from 'pages/orders/OrdersPage';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Dashboard from './Dashboard';

//const Dashboard = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Dashboard'));
//const Menu = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/menu/Menu'));
//const Orders = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/orders/OrdersPage'));
//const DeliveryArea = React.lazy(
//  () => import(/* webpackPrefetch: true */ 'pages/delivery-area/DeliveryArea')
//);
//const BusinessProfile = React.lazy(
//  () => import(/* webpackPrefetch: true */ 'pages/business-profile/BusinessProfile')
//);
//const BankingInformation = React.lazy(
//  () => import(/* webpackPrefetch: true */ 'pages/business-profile/BankingInformation')
//);

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
        <Route path={`${path}/delivery-area`} component={DeliveryArea} />
        <Route path={`${path}/business-profile`} component={BusinessProfile} />
        <Route path={`${path}/banking`} component={BankingInformation} />
      </PageLayout>
    </Switch>
  );
};

export default Home;
