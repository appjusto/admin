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
const Menu = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/menu/MenuPage'));
const Orders = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/orders/OrdersPage'));
const DeliveryArea = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/delivery-area/DeliveryAreaPage')
);
const BusinessProfile = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/business-profile/BusinessProfilePage')
);
const BankingInformation = React.lazy(
  () => import(/* webpackPrefetch: true */ 'pages/business-profile/BankingInformationPage')
);

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/join" component={Join} />
          <ProtectedRoute path="/logout" component={Logout} />
          <ProtectedRoute path="/onboarding" component={Onboarding} />
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/menu" component={Menu} />
          <ProtectedRoute path="/orders" component={Orders} />
          <ProtectedRoute path="/delivery-area" component={DeliveryArea} />
          <ProtectedRoute path="/business-profile" component={BusinessProfile} />
          <ProtectedRoute path="/banking" component={BankingInformation} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
