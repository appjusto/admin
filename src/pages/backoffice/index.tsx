import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import BODashboard from './dashboard';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // UI
  return (
    <Switch>
      <PageLayout>
        <Route exact path={path} component={BODashboard} />
        {/*<Route path={`${path}/menu`} component={Menu} />*/}
      </PageLayout>
    </Switch>
  );
};

export default BackOffice;
