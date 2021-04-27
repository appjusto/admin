import { useContextApi } from 'app/state/api/context';
import { BusinessPrivatePlatform } from 'appjusto-types';
import React from 'react';

export const useBusinessPrivateData = (businessId: string) => {
  // context
  const api = useContextApi();
  // state
  const [plaform, setPlatform] = React.useState<BusinessPrivatePlatform>({});

  // side effects
  React.useEffect(() => {
    const getPlatformData = async () => {
      const data = await api.business().getBusinessPlatformData(businessId);
      if (data) setPlatform(data);
    };
    getPlatformData();
  }, [api, businessId]);
  // return
  return plaform;
};
