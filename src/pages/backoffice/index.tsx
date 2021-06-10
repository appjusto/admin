import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { AgentProfile } from './agent/AgentProfile';
import AgentsPage from './agents/AgentsPage';
import BusinessesPage from './businesses';
import ConsumersPage from './consumers';
import CouriersPage from './couriers';
import BODashboard from './dashboard';
import OrdersPage from './orders';
import { BOAccessRoute } from './routes/BOAccessRoute';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <PageLayout maxW="1024px">
      <Switch>
        <BOAccessRoute path={`${path}/orders`} component={OrdersPage} />
        <BOAccessRoute path={`${path}/couriers`} component={CouriersPage} />
        <BOAccessRoute path={`${path}/businesses`} component={BusinessesPage} />
        <BOAccessRoute path={`${path}/consumers`} component={ConsumersPage} />
        <BOAccessRoute path={`${path}/agents`} component={AgentsPage} />
        <BOAccessRoute path={`${path}/agent-profile`} component={AgentProfile} />
        <BOAccessRoute path={path} component={BODashboard} />
      </Switch>
    </PageLayout>
  );
};

export default BackOffice;
