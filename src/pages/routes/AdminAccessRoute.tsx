import { useContextFirebaseUser } from 'app/state/auth/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isAccessGranted } from 'utils/access';

export const AdminAccessRoute = (props: RouteProps) => {
  // context
  const { isBackofficeUser, adminRole } = useContextFirebaseUser();
  const { path } = props;
  // redirects
  if (isBackofficeUser) return <Route {...props} />;
  if (path && adminRole) {
    if (path === '/app' || isAccessGranted('admin', path as string, undefined, adminRole))
      return <Route {...props} />;
    else return <Redirect to="/app" push />;
  }
  // loading
  return <Loading />;
};
