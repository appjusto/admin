import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { useApi } from 'app/state/api/context';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const api = useApi();
  const user = useFirebaseUser();

  // side effects
  React.useEffect(() => {
    api.auth().signOut();
  }, [api]);

  if (!user) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
