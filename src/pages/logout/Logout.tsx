import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const user = useFirebaseUser();
  const { signOut } = useAuthentication();
  // state
  const [isLogout, setIsLogout] = React.useState<boolean>();
  // side effects
  React.useEffect(() => {
    if (!user?.email) return;
    signOut(user.email);
    setIsLogout(true);
  }, [user, signOut]);
  // UI
  if (isLogout) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
