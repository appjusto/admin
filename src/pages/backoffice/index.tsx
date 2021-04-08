import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import BusinessesPage from './businesses';
import CouriersPage from './couriers';
import BODashboard from './dashboard';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // handlers

  // UI
  return (
    <Switch>
      <PageLayout maxW="1024px">
        <Route exact path={path} component={BODashboard} />
        <Route path={`${path}/businesses`} component={BusinessesPage} />
        <Route path={`${path}/couriers`} component={CouriersPage} />
        {/*<Route path={`${path}/menu`} component={Menu} />*/}
      </PageLayout>
    </Switch>
  );
};

export default BackOffice;
