import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { BusinessDashboardProvider } from 'app/state/dashboards/business';
import { OrdersContextProvider } from 'app/state/order';
import { Loading } from 'common/components/Loading';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import SchedulesPage from 'pages/business-schedules/SchedulesPage';
import ChatPage from 'pages/chat';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import FinancesPage from 'pages/finances/FinancesPage';
import { UserNotFound } from 'pages/join/UserNotFound';
import ManagerProfilePage from 'pages/manager-profile/ManagerProfilePage';
import Menu from 'pages/menu/Menu';
import OrdersHistoryPage from 'pages/orders/history/OrdersHistoryPage';
import OrdersPage from 'pages/orders/OrdersPage';
import PageLayout from 'pages/PageLayout';
import SharingPage from 'pages/sharing';
import TeamPage from 'pages/team/TeamPage';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { AgentPersonificationBar } from './AgentPersonificationBar';
import Dashboard from './Dashboard';

const timeoutLimit = 6; // in seconds

const Home = () => {
  // context
  const { isBackofficeUser, role } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { path } = useRouteMatch();
  // states
  const [isTimeout, setIsTimeout] = React.useState(false);
  // helpers
  const userWithGrantedRole = role != null;
  // side effects
  React.useEffect(() => {
    const timer = setTimeout(() => setIsTimeout(true), timeoutLimit * 1000);
    return () => clearTimeout(timer);
  }, []);
  // UI
  if (!business) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else if (isTimeout && business === null) return <Redirect to={`/onboarding`} />;
  }
  if (business && business?.onboarding !== 'completed' && !isBackofficeUser) {
    return <Redirect to={`/onboarding/${!business?.onboarding ? '' : business.onboarding}`} />;
  }
  if (business?.onboarding === 'completed' && !userWithGrantedRole && isTimeout) {
    return <UserNotFound />;
  }
  if (business?.onboarding === 'completed' && userWithGrantedRole) {
    return (
      <BusinessDashboardProvider>
        <OrdersContextProvider>
          {isBackofficeUser && <AgentPersonificationBar />}
          <Switch>
            <Route path={`${path}/orders`} component={OrdersPage} />
            <Route path={`${path}/chat`} component={ChatPage} />
            <PageLayout mt={isBackofficeUser ? '60px' : '0'}>
              <Route exact path={path} component={Dashboard} />
              <Route path={`${path}/sharing`} component={SharingPage} />
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
        </OrdersContextProvider>
      </BusinessDashboardProvider>
    );
  }
  return <Loading timeout={timeoutLimit} />;
};

export default Home;
