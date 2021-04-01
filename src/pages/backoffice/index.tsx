import PageLayout from 'pages/PageLayout';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { BOOrdersContextProvider } from './context/BOOrdersContext';
import { BusinessesContextProvider } from './context/BusinessesContext';
import BODashboard from './dashboard';
import { BusinessDrawer } from './drawers/business';

const BackOffice = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // handlers
  const closeDrawerHandler = () => history.replace(path);
  // UI
  return (
    <BusinessesContextProvider>
      <BOOrdersContextProvider>
        <Switch>
          <PageLayout>
            <Route exact path={path} component={BODashboard} />
            {/*<Route path={`${path}/menu`} component={Menu} />*/}
          </PageLayout>
          <Route path={`${path}/business/:businessId`}>
            <BusinessDrawer isOpen onClose={closeDrawerHandler} />
          </Route>
        </Switch>
      </BOOrdersContextProvider>
    </BusinessesContextProvider>
  );
};

export default BackOffice;
