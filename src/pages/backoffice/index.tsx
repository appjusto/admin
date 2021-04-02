import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import BusinessesPage from './businesses';
import { BOOrdersContextProvider } from './context/BOOrdersContext';
import { BusinessesContextProvider } from './context/BusinessesContext';
import BODashboard from './dashboard';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  // handlers

  // UI
  return (
    <BusinessesContextProvider>
      <BOOrdersContextProvider>
        <Switch>
          <PageLayout maxW="1024px">
            <Route exact path={path} component={BODashboard} />
            <Route path={`${path}/businesses`} component={BusinessesPage} />
            {/*<Route path={`${path}/menu`} component={Menu} />*/}
          </PageLayout>
        </Switch>
      </BOOrdersContextProvider>
    </BusinessesContextProvider>
  );
};

export default BackOffice;
