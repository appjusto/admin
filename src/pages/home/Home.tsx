import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { BusinessDashboardProvider } from 'app/state/dashboards/business';
import { MenuContextProvider } from 'app/state/menu/context';
import { OrdersContextProvider } from 'app/state/order';
import { Loading } from 'common/components/Loading';
import BankingInformation from 'pages/banking-information/BankingInformation';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import SchedulesPage from 'pages/business-schedules/SchedulesPage';
import ChatPage from 'pages/chat';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import { BasicErrorPage } from 'pages/error/BasicErrorPage';
import FinancesPage from 'pages/finances/FinancesPage';
import ManagerProfilePage from 'pages/manager-profile/ManagerProfilePage';
import Menu from 'pages/menu/Menu';
import OrdersHistoryPage from 'pages/orders/history/OrdersHistoryPage';
import OrdersPage from 'pages/orders/OrdersPage';
import PageLayout from 'pages/PageLayout';
import { AdminAccessRoute } from 'pages/routes/AdminAccessRoute';
import SharingPage from 'pages/sharing';
import TeamPage from 'pages/team/TeamPage';
import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
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
  if (business?.situation === 'deleted') {
    if (isBackofficeUser) return <Redirect to="/backoffice/businesses" />;
    else return <Redirect to={`/deleted`} />;
  }
  if (!business) {
    if (isBackofficeUser) return <Redirect to="/backoffice" />;
    else if (isTimeout && business === null) return <Redirect to={`/onboarding`} />;
  }
  if (business && business?.onboarding !== 'completed' && !isBackofficeUser) {
    return <Redirect to={`/onboarding/${!business?.onboarding ? '' : business.onboarding}`} />;
  }
  if (business?.onboarding === 'completed' && !userWithGrantedRole && isTimeout) {
    return (
      <BasicErrorPage
        title="Ocorreu um erro de autenticação."
        description="Não foi possível acessar as credenciais do seu usuário. Já tentou recarregar esta página?"
      />
    );
  }
  if (
    (business && isBackofficeUser) ||
    (business?.onboarding === 'completed' && userWithGrantedRole)
  ) {
    return (
      <BusinessDashboardProvider>
        <OrdersContextProvider>
          <MenuContextProvider>
            {isBackofficeUser && <AgentPersonificationBar />}
            <Switch>
              <AdminAccessRoute path={`${path}/orders`} component={OrdersPage} />
              <AdminAccessRoute path={`${path}/chat`} component={ChatPage} />
              <PageLayout mt={isBackofficeUser ? '60px' : '0'}>
                <AdminAccessRoute exact path={path} component={Dashboard} />
                <AdminAccessRoute path={`${path}/sharing`} component={SharingPage} />
                <AdminAccessRoute path={`${path}/menu`} component={Menu} />
                <AdminAccessRoute path={`${path}/business-schedules`} component={SchedulesPage} />
                <AdminAccessRoute path={`${path}/delivery-area`} component={DeliveryArea} />
                <AdminAccessRoute path={`${path}/business-profile`} component={BusinessProfile} />
                <AdminAccessRoute path={`${path}/manager-profile`} component={ManagerProfilePage} />
                <AdminAccessRoute path={`${path}/orders-history`} component={OrdersHistoryPage} />
                <AdminAccessRoute path={`${path}/finances`} component={FinancesPage} />
                <AdminAccessRoute
                  path={`${path}/banking-information`}
                  component={BankingInformation}
                />
                <AdminAccessRoute path={`${path}/team`} component={TeamPage} />
              </PageLayout>
            </Switch>
          </MenuContextProvider>
        </OrdersContextProvider>
      </BusinessDashboardProvider>
    );
  }
  return <Loading timeout={timeoutLimit} />;
};

export default Home;
