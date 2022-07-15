import { BackofficeDashboardProvider } from 'app/state/dashboards/backoffice';
import PageLayout from 'pages/PageLayout';
import { Switch, useRouteMatch } from 'react-router-dom';
import BusinessesPage from './businesses';
import ConsumersPage from './consumers';
import CouriersPage from './couriers';
import BODashboard from './dashboard';
import FraudPreventionPage from './fraud-prevention';
import InvoicesPage from './invoices';
import OrdersPage from './orders';
import ParametersPage from './parameters';
import RecommendationsPage from './recommendations';
import { BOAccessRoute } from './routes/BOAccessRoute';
import { StaffProfile } from './staff/StaffProfile';
import StaffsPage from './staffs';
import UsersPage from './users';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <BackofficeDashboardProvider>
      <PageLayout maxW="1124px">
        <Switch>
          <BOAccessRoute path={`${path}/orders`} component={OrdersPage} />
          <BOAccessRoute path={`${path}/couriers`} component={CouriersPage} />
          <BOAccessRoute path={`${path}/businesses`} component={BusinessesPage} />
          <BOAccessRoute path={`${path}/consumers`} component={ConsumersPage} />
          <BOAccessRoute path={`${path}/invoices`} component={InvoicesPage} />
          <BOAccessRoute path={`${path}/staff`} component={StaffsPage} />
          <BOAccessRoute path={`${path}/fraud-prevention`} component={FraudPreventionPage} />
          <BOAccessRoute path={`${path}/staff-profile`} component={StaffProfile} />
          <BOAccessRoute path={`${path}/users`} component={UsersPage} />
          <BOAccessRoute path={`${path}/recommendations`} component={RecommendationsPage} />
          <BOAccessRoute path={`${path}/platform`} component={ParametersPage} />

          <BOAccessRoute path={path} component={BODashboard} />
        </Switch>
      </PageLayout>
    </BackofficeDashboardProvider>
  );
};

export default BackOffice;
