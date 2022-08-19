import { MarketplaceAccountInfo } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useBusinessMarketPlace = (businessId: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('businesses');
  // state
  const [marketPlace, setMarketPlace] =
    React.useState<MarketplaceAccountInfo | null>();
  // mutations
  const {
    mutateAsync: deleteMarketPlace,
    mutationResult: deleteMarketPlaceResult,
  } = useCustomMutation(
    async () => api.business().deletePrivateMarketPlace(businessId),
    'deleteMarketPlace'
  );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    return api
      .business()
      .observeBusinessMarketPlace(businessId, setMarketPlace);
  }, [api, userCanRead, businessId]);
  // return
  return { marketPlace, deleteMarketPlace, deleteMarketPlaceResult };
};
