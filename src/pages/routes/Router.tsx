import { Loading } from 'common/components/Loading';
import LandingPage from 'pages/landing/LandingPage';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BackOfficeRoute } from './BackOfficeRoute';
import { ProtectedRoute } from './ProtectedRoute';

const Login = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/login/Login'));
const Join = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/join/Join'));
const Onboarding = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/onboarding/OnboardingPage')
);
const Logout = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/logout/Logout'));
const Home = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Home'));
const BackOffice = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/backoffice'));
const DeletedPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/deleted/DeletedPage')
);
const PageNotFound = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/404'));

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/join" component={Join} />
          <Route path="/deleted" component={DeletedPage} />
          <ProtectedRoute path="/app" component={Home} />
          <ProtectedRoute path="/onboarding" component={Onboarding} />
          <BackOfficeRoute path="/backoffice" component={BackOffice} />
          <ProtectedRoute path="/logout" component={Logout} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
