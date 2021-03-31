import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

type Status = 'initial' | 'unauthenticated' | 'authenticated' | 'profile-loaded';

type role = 'root' | 'staff' | 'admin' | 'collaborator';

export const BackOfficeRoute = (props: RouteProps) => {
  // context
  const user = useContextFirebaseUser();
  const profile = useContextManagerProfile();

  // state
  const [status, setStatus] = React.useState<Status>('initial');

  // side effects
  const delay = 4000; // delay to wait for firebase initialization
  React.useEffect(() => {
    if (!user) {
      const uid = setTimeout(() => {
        setStatus(!user ? 'unauthenticated' : 'authenticated');
      }, delay);
      return () => clearTimeout(uid);
    }
    if (user && profile) setStatus('profile-loaded');
  }, [user, profile]);

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
