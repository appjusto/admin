import { useContextApi } from 'app/state/api/context';
import React from 'react';

interface Platform {
  marketPlace?: {
    issues?: string[];
  };
}

export const useBusinessPrivateData = (businessId: string) => {
  // context
  const api = useContextApi();
  // state
  const [plaform, setPlatform] = React.useState<Platform>({});

  // side effects
  React.useEffect(() => {
    const getPlatformData = async () => {
      const data = await api.business().getBusinessPlatformData(businessId);
      if (data) setPlatform(data);
    };
    getPlatformData();
  }, [api]); //attention to 'options' to avoid infinite renders
  // return
  return plaform;
};
