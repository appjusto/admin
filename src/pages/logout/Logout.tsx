import { useAuthentication } from 'app/api/auth/useAuthentication';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const { signOut } = useAuthentication();
  // state
  const [isLogout, setIsLogout] = React.useState<boolean>();
  // side effects
  React.useEffect(() => {
    signOut();
    setIsLogout(true);
  }, [signOut]);
  // UI
  if (isLogout) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
