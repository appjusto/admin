import { Flavor, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';

export const useObserveBannersByFlavor = (flavor: Flavor) => {
  // context
  const api = useContextApi();
  // state
  const [banners, setBanners] = React.useState<WithId<Banner>[] | null>();
  // side effects
  React.useEffect(() => {
    api.banners().observeBannersByFlavor(flavor, setBanners);
  }, [api, flavor]);
  // result
  return banners;
};
