import { useContextFirebaseUser } from 'app/state/auth/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const BOAccessRoute = (props: RouteProps) => {
  // context
  const { role } = useContextFirebaseUser();
  // redirects
  if (role) {
    if (role === 'courier-manager' && props.path !== '/backoffice/couriers')
      return <Redirect to="/backoffice/couriers" push />;
    else return <Route {...props} />;
  }
  return <Loading />;
};
