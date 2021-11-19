import { BackofficeDashboardProvider } from 'app/state/dashboards/backoffice';
import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { AgentProfile } from './agent/AgentProfile';
import AgentsPage from './agents/AgentsPage';
import BusinessesPage from './businesses';
import ConsumersPage from './consumers';
import CouriersPage from './couriers';
import BODashboard from './dashboard';
import FraudPreventionPage from './fraud-prevention';
import InvoicesPage from './invoices';
import OrdersPage from './orders';
import RecommendationsPage from './recommendations';
import { BOAccessRoute } from './routes/BOAccessRoute';
import UsersPage from './users';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <BackofficeDashboardProvider>
      <PageLayout maxW="1024px">
        <Switch>
          <BOAccessRoute path={`${path}/orders`} component={OrdersPage} />
          <BOAccessRoute path={`${path}/couriers`} component={CouriersPage} />
          <BOAccessRoute path={`${path}/businesses`} component={BusinessesPage} />
          <BOAccessRoute path={`${path}/consumers`} component={ConsumersPage} />
          <BOAccessRoute path={`${path}/invoices`} component={InvoicesPage} />
          <BOAccessRoute path={`${path}/agents`} component={AgentsPage} />
          <BOAccessRoute path={`${path}/fraud-prevention`} component={FraudPreventionPage} />
          <BOAccessRoute path={`${path}/agent-profile`} component={AgentProfile} />
          <BOAccessRoute path={`${path}/users`} component={UsersPage} />
          <BOAccessRoute path={`${path}/recommendations`} component={RecommendationsPage} />
          <BOAccessRoute path={path} component={BODashboard} />
        </Switch>
      </PageLayout>
    </BackofficeDashboardProvider>
  );
};

export default BackOffice;
