import { Loading } from 'common/components/Loading';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const Login = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/login/Login'));
const Join = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/join/Join'));
const Logout = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/logout/Logout'));
const Onboarding = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/onboarding/OnboardingPage')
);
const Home = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Home'));

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/join" component={Join} />
          <ProtectedRoute exact path="/" />
          <ProtectedRoute path="/app" component={Home} />
          <ProtectedRoute path="/logout" component={Logout} />
          <ProtectedRoute path="/onboarding" component={Onboarding} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
