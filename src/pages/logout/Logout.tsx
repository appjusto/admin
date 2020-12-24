import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { useContextApi } from 'app/state/api/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const api = useContextApi();
  const user = useFirebaseUser();

  // side effects
  React.useEffect(() => {
    api.auth().signOut();
  }, [api]);

  if (!user) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
