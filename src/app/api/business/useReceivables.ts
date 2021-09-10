import { useContextApi } from 'app/state/api/context';
import { IuguMarketplaceAccountReceivables } from 'appjusto-types/payment/iugu';
import React from 'react';
//import { useMutation } from 'react-query';

export const useReceivables = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [receivables, setReceivables] = React.useState<IuguMarketplaceAccountReceivables>();
  // mutations
  //const [deleteMarketPlace, deleteMarketPlaceResult] = useMutation(async () =>
  //  api.business().deletePrivateMarketPlace(businessId)
  //);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    (async () => {
      const result = await api.business().fetchReceivables(businessId);
      if (result) setReceivables(result);
    })();
  }, [api, businessId]);
  // return
  return { receivables };
};
