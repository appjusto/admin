import { useToast } from '@chakra-ui/toast';
import * as Sentry from '@sentry/react';
import { useFirebaseUser } from 'app/api/auth/useFirebaseUser';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { CustomToast } from 'common/components/CustomToast';
import { Loading } from 'common/components/Loading';
import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  // context
  const api = useContextApi();
  const user = useFirebaseUser();
  const { business } = useContextBusiness();
  const { updateBusinessProfile, updateResult } = useBusinessProfile();
  // state
  const [isLogout, setIsLogout] = React.useState<boolean>();
  //handlers
  const toast = useToast();
  // side effects
  React.useEffect(() => {
    if (business?.status === 'open') {
      updateBusinessProfile({ status: 'closed' });
    } else setIsLogout(true);
  }, [business, updateBusinessProfile]);
  React.useEffect(() => {
    if (isLogout || updateResult.isSuccess) api.auth().signOut();
    else if (updateResult.isError) {
      Sentry.captureException({ type: 'LogoutUpdateError', error: updateResult.error });
      toast({
        duration: 12000,
        render: () => (
          <CustomToast
            type="warning"
            message={{
              title: 'Feche o restaurante antes de sair.',
              description:
                'Redirecionando para o gerenciador de pedidos, para que você possa fechar o restaurante antes de sair.',
            }}
          />
        ),
      });
      setTimeout(() => setIsLogout(false), 5000);
    }
  }, [api, isLogout, updateResult, toast]);
  // UI
  if (isLogout === false) return <Redirect to="/app/orders" />;
  if (user === null) return <Redirect to="/" />;
  return <Loading />;
};

export default Logout;
