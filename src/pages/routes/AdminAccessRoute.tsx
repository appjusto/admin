import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextStaffProfile } from 'app/state/staff/context';
import { Loading } from 'common/components/Loading';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isAccessGranted } from 'utils/access';

export const AdminAccessRoute = (props: RouteProps) => {
  // context
  const { adminRole } = useContextFirebaseUser();
  const { isBackofficeUser } = useContextStaffProfile();
  const path = props.path as string;
  // redirects
  if (isBackofficeUser) return <Route {...props} />;
  if (path && adminRole) {
    if (path === '/app' || isAccessGranted({ type: 'admin', path, adminRole }))
      return <Route {...props} />;
    else return <Redirect to="/app" push />;
  }
  // loading
  return <Loading />;
};
