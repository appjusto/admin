import { isElectron } from '@firebase/util';
import { Loading } from 'common/components/Loading';
import { WelcomePage } from 'pages/desktop/WelcomePage';
import LandingPage from 'pages/landing/LandingPage';
import Login from 'pages/login/Login';
import Logout from 'pages/logout/Logout';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BackOfficeRoute } from './BackOfficeRoute';
import MainErrorBoundary from './MainErrorBoundary';
import { ProtectedRoute } from './ProtectedRoute';

// const Login = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/login/Login'));
// const Logout = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/logout/Logout'));
const Join = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/join/Join'));
const Onboarding = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/onboarding/OnboardingPage')
);
const Home = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Home'));
const BackOffice = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/backoffice'));
const DeletedPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/deleted/DeletedPage')
);
const PageNotFound = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/404'));
const InactiveAppVersionPage = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/error/InactiveAppVersionPage')
);

const isDesktopApp = isElectron();
console.log("isDesktopApp", isDesktopApp);
export const Router = () => {
  return (
    <MainErrorBoundary>
      <BrowserRouter>
        <React.Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/" component={isDesktopApp ? WelcomePage : LandingPage} />
            <Route path="/login" component={Login} />
            <Route path="/join" component={Join} />
            <Route path="/deleted" component={DeletedPage} />
            <Route path="/inactive-version" component={InactiveAppVersionPage} />
            <ProtectedRoute path="/app" component={Home} />
            <ProtectedRoute path="/onboarding" component={Onboarding} />
            <BackOfficeRoute path="/backoffice" component={BackOffice} />
            <ProtectedRoute path="/logout" component={Logout} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </MainErrorBoundary>
  );
};
