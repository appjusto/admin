import { Loading } from 'common/components/Loading';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const Login = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/login/Login'));
const Join = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/join/Join'));
const Onboarding = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/onboarding/OnboardingHome'));
const Home = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Home'));
const Menu = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/menu/Menu'));
const Profile = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/profile/Profile'));

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/join" component={Join} />
          <ProtectedRoute path="/onboarding" component={Onboarding} />
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/menu" component={Menu} />
          <ProtectedRoute path="/profile" component={Profile} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
