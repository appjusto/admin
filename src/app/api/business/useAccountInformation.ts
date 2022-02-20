import { useContextApi } from 'app/state/api/context';
import { FetchAccountInformationResponse } from '@appjusto/types';
import React from 'react';
import * as Sentry from '@sentry/react';

export const useAccountInformation = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [
    accountInformation,
    setAccountInformation,
  ] = React.useState<FetchAccountInformationResponse | null>();
  // handlers
  const refreshAccountInformation = React.useCallback(() => {
    if (!businessId) return;
    (async () => {
      try {
        const result = await api.business().fetchAccountInformation(businessId);
        if (result) setAccountInformation(result);
        else setAccountInformation(null);
      } catch (error) {
        Sentry.captureException(error);
        setAccountInformation(null);
      }
    })();
  }, [api, businessId]);
  // side effects
  React.useEffect(() => {
    refreshAccountInformation();
  }, [refreshAccountInformation]);
  // return
  return { accountInformation, refreshAccountInformation };
};
