import { useContextApi } from 'app/state/api/context';
import { MarketplaceAccountInfo } from 'appjusto-types';
import React from 'react';

export const useBusinessMarketPlaceData = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [marketplace, setMarketplace] = React.useState<MarketplaceAccountInfo>();

  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const getPlatformData = async () => {
      const data = await api.business().getBusinessMarketPlaceData(businessId);
      if (data) setMarketplace(data);
    };
    getPlatformData();
  }, [api, businessId]);
  // return
  return marketplace;
};
