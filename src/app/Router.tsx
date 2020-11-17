import { Loading } from 'common/components/Loading';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Home = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/home/Home'));
const Menu = React.lazy(() => import(/* webpackPrefetch: true */ 'pages/menu/Menu'));

export const Router = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/menu" component={Menu} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};
