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
    localStorage.removeItem(`business-${process.env.REACT_APP_ENVIRONMENT}`);
    signOut();
    setIsLogout(true);
  }, [signOut]);
  // UI
  if (isLogout) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
