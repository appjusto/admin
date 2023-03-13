import { useAuthentication } from 'app/api/auth/useAuthentication';
import { useContextFirebaseUserEmail } from 'app/state/auth/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const email = useContextFirebaseUserEmail();
  const { signOut, signOutResult } = useAuthentication();
  const { isSuccess } = signOutResult;
  // side effects
  React.useEffect(() => {
    if (email) signOut({ email });
    else signOut({});
  }, [email, signOut]);
  // UI
  if (isSuccess) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
