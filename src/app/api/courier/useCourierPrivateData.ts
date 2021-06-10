import { useContextApi } from 'app/state/api/context';
import { MarketplaceAccountInfo } from 'appjusto-types';
import React from 'react';

export const useCourierPrivateData = (courierId: string) => {
  // context
  const api = useContextApi();
  // state
  const [marketplace, setMarketplace] = React.useState<MarketplaceAccountInfo>();
  // side effects
  React.useEffect(() => {
    const getPlatformData = async () => {
      const data = await api.courier().getCourierMarketPlaceData(courierId);
      if (data) setMarketplace(data);
    };
    getPlatformData();
  }, [api, courierId]);
  // return
  return marketplace;
};
