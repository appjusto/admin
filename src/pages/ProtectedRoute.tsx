import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const ProtectedRoute = (props: RouteProps) => {
  const user = useContextFirebaseUser();
  const profile = useContextManagerProfile();
  if (user === null) return <Redirect to="/" />; // when strictly equals to null, there's no firebase user
  if (!profile) return <></>; // still loading user's profile

  return <Route {...props} />;
};
