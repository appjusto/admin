import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

type Status = 'initial' | 'unauthenticated' | 'authenticated' | 'profile-loaded';

export const ProtectedRoute = (props: RouteProps) => {
  // context
  const user = useContextFirebaseUser();
  const profile = useContextManagerProfile();

  // state
  const [status, setStatus] = React.useState<Status>('initial');

  // side effects
  const delay = 5000; // delay to wait for firebase initialization
  React.useEffect(() => {
    if (user) setStatus('authenticated');
    else {
      const uid = setTimeout(() => {
        setStatus(!user ? 'unauthenticated' : 'authenticated');
      }, delay);
      return () => clearTimeout(uid);
    }
  }, [user]);
  React.useEffect(() => {
    if (profile) setStatus('profile-loaded');
  }, [profile]);

  // UI
  // redirects to / when user is not authenticated
  if (status === 'unauthenticated') return <Redirect to="/login" />;
  // load route when profile is loaded
  if (status === 'profile-loaded') {
    return <Route {...props} />;
  }
  // still loading user's profile
  return <Loading />;
};
