import { Loading } from 'common/components/Loading';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const Login = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/login/Login'));
const Join = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/join/Join'));
const Menu = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/menu/Menu'));

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/join" component={Join} />
          <ProtectedRoute path="/menu" component={Menu} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
