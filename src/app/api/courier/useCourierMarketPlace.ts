import { useContextApi } from 'app/state/api/context';
import { MarketplaceAccountInfo } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useCourierMarketPlace = (courierId: string) => {
  // context
  const api = useContextApi();
  // state
  const [marketPlace, setMarketPlace] = React.useState<MarketplaceAccountInfo | null>();
  // mutations
  const [deleteMarketPlace, deleteMarketPlaceResult] = useMutation(async () =>
    api.courier().deletePrivateMarketPlace(courierId)
  );
  // side effects
  React.useEffect(() => {
    if (!courierId) return;
    return api.courier().observeCourierMarketPlace(courierId, setMarketPlace);
  }, [api, courierId]);
  // return
  return { marketPlace, deleteMarketPlace, deleteMarketPlaceResult };
};
