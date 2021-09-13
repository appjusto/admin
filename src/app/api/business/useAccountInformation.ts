import { useContextApi } from 'app/state/api/context';
import { FetchAccountInformationResponse } from 'appjusto-types';
import React from 'react';

export const useAccountInformation = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [
    accountInformation,
    setAccountInformation,
  ] = React.useState<FetchAccountInformationResponse>();
  // handlers
  const refreshAccountInformation = React.useCallback(() => {
    if (!businessId) return;
    (async () => {
      const result = await api.business().fetchAccountInformation(businessId);
      if (result) setAccountInformation(result);
    })();
  }, [api, businessId]);
  // side effects
  React.useEffect(() => {
    refreshAccountInformation();
  }, [refreshAccountInformation]);
  // return
  return { accountInformation, refreshAccountInformation };
};
