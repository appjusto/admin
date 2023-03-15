import { BackofficeDashboardProvider } from 'app/state/dashboards/backoffice';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import BODashboard from './dashboard';
import { BOAccessRoute } from './routes/BOAccessRoute';

const OrdersPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './orders')
);
const CouriersPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './couriers')
);
const BusinessesPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './businesses')
);
const ConsumersPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './consumers')
);

const BannersPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './banners')
);

const InvoicesPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './invoices')
);
const LedgerPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './ledger')
);
const StaffsPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './staffs')
);
const FraudPreventionPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './fraud-prevention')
);
const PushCampaignPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './push-campaigns')
);
const StaffProfile = React.lazy(
  () => import(/* webpackPrefetch: true */ './staff/StaffProfile')
);
const UsersPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './users')
);
const AreasPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './areas')
);
const RecommendationsPage = React.lazy(
  () => import(/* webpackPrefetch: true */ './recommendations')
);

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
          <BOAccessRoute
            path={`${path}/businesses`}
            component={BusinessesPage}
          />
          <BOAccessRoute path={`${path}/consumers`} component={ConsumersPage} />
          <BOAccessRoute path={`${path}/banners`} component={BannersPage} />
          <BOAccessRoute path={`${path}/invoices`} component={InvoicesPage} />
          <BOAccessRoute path={`${path}/ledger`} component={LedgerPage} />
          <BOAccessRoute path={`${path}/staff`} component={StaffsPage} />
          <BOAccessRoute
            path={`${path}/fraud-prevention`}
            component={FraudPreventionPage}
          />
          <BOAccessRoute
            path={`${path}/push-campaigns`}
            component={PushCampaignPage}
          />
          <BOAccessRoute
            path={`${path}/staff-profile`}
            component={StaffProfile}
          />
          <BOAccessRoute path={`${path}/users`} component={UsersPage} />
          <BOAccessRoute
            path={`${path}/recommendations`}
            component={RecommendationsPage}
          />
          <BOAccessRoute path={`${path}/areas`} component={AreasPage} />
          <BOAccessRoute path={path} component={BODashboard} />
        </Switch>
      </PageLayout>
    </BackofficeDashboardProvider>
  );
};

export default BackOffice;
