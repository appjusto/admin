import { WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';

export const useObserveBanners = () => {
  // context
  const api = useContextApi();
  // state
  const [banners, setBanners] = React.useState<WithId<Banner>[] | null>();
  // side effects
  React.useEffect(() => {
    api.banners().observeBanners(setBanners);
  }, [api]);
  // result
  return banners;
};
