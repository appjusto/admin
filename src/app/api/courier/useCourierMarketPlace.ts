import { MarketplaceAccountInfo } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useCourierMarketPlace = (courierId: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('couriers');
  // state
  const [marketPlace, setMarketPlace] =
    React.useState<MarketplaceAccountInfo | null>();
  // mutations
  const {
    mutateAsync: deleteMarketPlace,
    mutationResult: deleteMarketPlaceResult,
  } = useCustomMutation(
    async () => api.courier().deletePrivateMarketPlace(courierId),
    'deleteMarketPlace'
  );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!courierId) return;
    return api.courier().observeCourierMarketPlace(courierId, setMarketPlace);
  }, [api, userCanRead, courierId]);
  // return
  return { marketPlace, deleteMarketPlace, deleteMarketPlaceResult };
};
