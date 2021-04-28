import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextBusiness } from 'app/state/business/context';
import { Loading } from 'common/components/Loading';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import SchedulesPage from 'pages/business-schedules/SchedulesPage';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import FinancesPage from 'pages/finances/FinancesPage';
import ManagerProfilePage from 'pages/manager-profile/ManagerProfilePage';
import Menu from 'pages/menu/Menu';
import OrdersHistoryPage from 'pages/orders/history/OrdersHistoryPage';
import OrdersPage from 'pages/orders/OrdersPage';
import PageLayout from 'pages/PageLayout';
import TeamPage from 'pages/team/TeamPage';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { AgentPersonificationBar } from './AgentPersonificationBar';
import Dashboard from './Dashboard';

const Home = () => {
  // context
  const { isBackofficeUser } = useContextAgentProfile();
  const { business } = useContextBusiness();
  const { path } = useRouteMatch();

  // UI
  if (business === null) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else return <Redirect to={`/onboarding`} />;
  }
  if (business && business?.onboarding !== 'completed') {
    return <Redirect to={`/onboarding/${!business?.onboarding ? '' : business.onboarding}`} />;
  }
  if (business?.onboarding === 'completed') {
    return (
      <>
        {isBackofficeUser && <AgentPersonificationBar />}
        <Switch>
          <Route path={`${path}/orders`} component={OrdersPage} />
          <PageLayout mt={isBackofficeUser ? '60px' : '0'}>
            <Route exact path={path} component={Dashboard} />
            <Route path={`${path}/menu`} component={Menu} />
            <Route path={`${path}/business-schedules`} component={SchedulesPage} />
            <Route path={`${path}/delivery-area`} component={DeliveryArea} />
            <Route path={`${path}/business-profile`} component={BusinessProfile} />
            <Route path={`${path}/manager-profile`} component={ManagerProfilePage} />
            <Route path={`${path}/orders-history`} component={OrdersHistoryPage} />
            <Route path={`${path}/finances`} component={FinancesPage} />
            <Route path={`${path}/team`} component={TeamPage} />
          </PageLayout>
        </Switch>
      </>
    );
  }
  return <Loading />;
};

export default Home;
