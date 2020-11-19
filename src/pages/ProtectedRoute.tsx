import { useProfile } from 'app/state/profile/context';
import { useFirebaseUser } from 'app/state/user/context';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const ProtectedRoute = (props: RouteProps) => {
  const user = useFirebaseUser();
  const profile = useProfile();
  if (user === null) return <Redirect to="/" />; // when strictly equals to null, there's no firebase user
  if (!profile) return <></>; // still loading user's profile

  return <Route {...props} />;
};
