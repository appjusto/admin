import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { BusinessDashboardProvider } from 'app/state/dashboards/business';
import { MenuContextProvider } from 'app/state/menu/context';
import { OrdersContextProvider } from 'app/state/order';
import { Loading } from 'common/components/Loading';
import { BasicErrorPage } from 'pages/error/BasicErrorPage';
import PageLayout from 'pages/PageLayout';
import { AdminAccessRoute } from 'pages/routes/AdminAccessRoute';
import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import { AgentPersonificationBar } from './AgentPersonificationBar';
// import Dashboard from './Dashboard';

const timeoutLimit = 6; // in seconds

const Dashboard = React.lazy(
  () => import(/* webpackPrefetch: true */ './dashboard')
);
const OrdersPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/orders/OrdersPage')
);
const ChatPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/chat')
);
const SharingPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/sharing')
);
const Menu = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/menu/Menu')
);
const SchedulesPage = React.lazy(
  () =>
    import(/* webpackPrefetch: true */ 'pages/business-schedules/SchedulesPage')
);
const DeliveryArea = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/delivery-area/DeliveryArea')
);
const BusinessProfile = React.lazy(
  () =>
    import(/* webpackPrefetch: true */ 'pages/business-profile/BusinessProfile')
);
const OperationPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/operation/OperationPage')
);
const ManagerProfilePage = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true */ 'pages/manager-profile/ManagerProfilePage'
    )
);
const OrdersHistoryPage = React.lazy(
  () =>
    import(/* webpackPrefetch: true */ 'pages/orders/history/OrdersHistoryPage')
);
const FinancesPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/finances/FinancesPage')
);
const BankingInformation = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true */ 'pages/banking-information/BankingInformation'
    )
);
const TeamPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/team/TeamPage')
);
const LogisticsPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/logistics/LogisticsPage')
);
const InsurancePage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/insurance/InsurancePage')
);
const IntegrationsPage = React.lazy(
  () =>
    import(/* webpackPrefetch: true */ 'pages/integrations/IntegrationsPage')
);

const Home = () => {
  // context
  const { isBackofficeUser, adminRole } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { path } = useRouteMatch();
  // states
  const [isTimeout, setIsTimeout] = React.useState(false);
  // helpers
  const userWithGrantedRole = isBackofficeUser || adminRole != null;
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
    else if (isTimeout && business === null)
      return <Redirect to={`/onboarding`} />;
  }
  if (business && business?.onboarding !== 'completed' && !isBackofficeUser) {
    return (
      <Redirect
        to={`/onboarding/${!business?.onboarding ? '' : business.onboarding}`}
      />
    );
  }
  if (
    business?.onboarding === 'completed' &&
    !userWithGrantedRole &&
    isTimeout
  ) {
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
              <AdminAccessRoute
                path={`${path}/orders`}
                component={OrdersPage}
              />
              <AdminAccessRoute path={`${path}/chat`} component={ChatPage} />
              <PageLayout mt={isBackofficeUser ? '60px' : '0'}>
                <AdminAccessRoute exact path={path} component={Dashboard} />
                <AdminAccessRoute
                  path={`${path}/sharing`}
                  component={SharingPage}
                />
                <AdminAccessRoute path={`${path}/menu`} component={Menu} />
                <AdminAccessRoute
                  path={`${path}/business-schedules`}
                  component={SchedulesPage}
                />
                <AdminAccessRoute
                  path={`${path}/delivery-area`}
                  component={DeliveryArea}
                />
                <AdminAccessRoute
                  path={`${path}/business-profile`}
                  component={BusinessProfile}
                />
                <AdminAccessRoute
                  path={`${path}/operation`}
                  component={OperationPage}
                />
                <AdminAccessRoute
                  path={`${path}/manager-profile`}
                  component={ManagerProfilePage}
                />
                <AdminAccessRoute
                  path={`${path}/orders-history`}
                  component={OrdersHistoryPage}
                />
                <AdminAccessRoute
                  path={`${path}/finances`}
                  component={FinancesPage}
                />
                <AdminAccessRoute
                  path={`${path}/banking-information`}
                  component={BankingInformation}
                />
                <AdminAccessRoute path={`${path}/team`} component={TeamPage} />
                <AdminAccessRoute
                  path={`${path}/logistics`}
                  component={LogisticsPage}
                />
                <AdminAccessRoute
                  path={`${path}/insurance`}
                  component={InsurancePage}
                />
                <AdminAccessRoute
                  path={`${path}/integrations`}
                  component={IntegrationsPage}
                />
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
