import { Loading } from 'common/components/Loading';
import LandingPage from 'pages/landing/LandingPage';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BackOfficeRoute } from './BackOfficeRoute';
import { ProtectedRoute } from './ProtectedRoute';

const Login = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/login/Login'));
const Join = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/join/Join'));
const Logout = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/logout/Logout'));
const Onboarding = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/onboarding/OnboardingPage')
);
const Home = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Home'));
const BackOffice = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/backoffice'));

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/join" component={Join} />
          <ProtectedRoute path="/app" component={Home} />
          <ProtectedRoute path="/logout" component={Logout} />
          <ProtectedRoute path="/onboarding" component={Onboarding} />
          <BackOfficeRoute path="/backoffice" component={BackOffice} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
