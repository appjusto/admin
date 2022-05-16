import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isAppVersionAllowed } from 'utils/version';
import packageInfo from '../../../package.json';

const version = packageInfo.version;

type Status = 'initial' | 'unauthenticated' | 'authenticated' | 'profile-loaded';

const delay = 4000; // delay to wait for firebase initialization

export const ProtectedRoute = (props: RouteProps) => {
  // context
  const { user, minVersion } = useContextFirebaseUser();
  const { manager } = useContextManagerProfile();
  const { staff } = useContextStaffProfile();
  // state
  const [status, setStatus] = React.useState<Status>('initial');
  // side effects
  React.useEffect(() => {
    if (!user) {
      const uid = setTimeout(() => {
        setStatus(!user ? 'unauthenticated' : 'authenticated');
      }, delay);
      return () => clearTimeout(uid);
    }
    if (user && (manager || staff)) setStatus('profile-loaded');
  }, [user, staff, manager]);
  // UI
  if (minVersion && !isAppVersionAllowed(minVersion, version)) {
    return <Redirect to="/inactive-version" />;
  }
  // redirects to / when user is not authenticated
  if (status === 'unauthenticated') return <Redirect to="/login" />;
  // load route when profile is loaded
  if (status === 'profile-loaded') {
    return <Route {...props} />;
  }
  // still loading user's profile
  return <Loading />;
};
