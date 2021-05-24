import { useContextApi } from 'app/state/api/context';
import { CourierPrivatePlatform } from 'appjusto-types';
import React from 'react';

export const useCourierPrivateData = (courierId: string) => {
  // context
  const api = useContextApi();
  // state
  const [plaform, setPlatform] = React.useState<CourierPrivatePlatform>({});
  // side effects
  React.useEffect(() => {
    const getPlatformData = async () => {
      const data = await api.courier().getCourierPlatformData(courierId);
      if (data) setPlatform(data);
    };
    getPlatformData();
  }, [api, courierId]);
  // return
  return plaform;
};
