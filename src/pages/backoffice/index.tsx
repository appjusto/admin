import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AgentProfile } from './agent/AgentProfile';
import AgentsPage from './agents/AgentsPage';
import BusinessesPage from './businesses';
import ConsumersPage from './consumers';
import CouriersPage from './couriers';
import BODashboard from './dashboard';
import OrdersPage from './orders';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // handlers

  // UI
  return (
    <Switch>
      <PageLayout maxW="1024px">
        <Route exact path={path} component={BODashboard} />
        <Route path={`${path}/orders`} component={OrdersPage} />
        <Route path={`${path}/couriers`} component={CouriersPage} />
        <Route path={`${path}/businesses`} component={BusinessesPage} />
        <Route path={`${path}/consumers`} component={ConsumersPage} />
        <Route path={`${path}/agents`} component={AgentsPage} />
        <Route path={`${path}/agent-profile`} component={AgentProfile} />
      </PageLayout>
    </Switch>
  );
};

export default BackOffice;
