import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextFirebaseUserEmail } from 'app/state/auth/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const email = useContextFirebaseUserEmail();
  const { signOut } = useAuthentication();
  // state
  const [isLogout, setIsLogout] = React.useState<boolean>();
  // side effects
  React.useEffect(() => {
    if (email) signOut(email);
    else signOut();
    setIsLogout(true);
  }, [email, signOut]);
  // UI
  if (isLogout) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
