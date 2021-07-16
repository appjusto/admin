import { useContextApi } from 'app/state/api/context';
import { MarketplaceAccountInfo } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useBusinessMarketPlace = (businessId: string) => {
  // context
  const api = useContextApi();
  // state
  const [marketPlace, setMarketPlace] = React.useState<MarketplaceAccountInfo | null>();
  // mutations
  const [deleteMarketPlace, deleteMarketPlaceResult] = useMutation(async () =>
    api.business().deletePrivateMarketPlace(businessId)
  );
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeBusinessMarketPlace(businessId, setMarketPlace);
  }, [api, businessId]);
  // return
  return { marketPlace, deleteMarketPlace, deleteMarketPlaceResult };
};
