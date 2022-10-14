import { ClientFlavor, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { getBannersByFlavorOrdered } from 'pages/backoffice/banners/utils';
import { Banner, BannersOrdering } from 'pages/backoffice/drawers/banner/types';
import React from 'react';

export const useObserveBannersByFlavor = (flavor: ClientFlavor) => {
  // context
  const api = useContextApi();
  // state
  const [banners, setBanners] = React.useState<WithId<Banner>[] | null>();
  const [ordering, setOrdering] = React.useState<BannersOrdering | null>();
  // side effects
  React.useEffect(() => {
    api.banners().observeBannersOrdering(setOrdering);
  }, [api]);
  React.useEffect(() => {
    if (!ordering) return;
    api.banners().observeBannersByFlavor(flavor, (data) => {
      if (data) {
        const ordered = getBannersByFlavorOrdered(ordering[flavor], data);
        setBanners(ordered);
      } else setBanners(data);
    });
  }, [api, ordering, flavor]);
  // result
  return banners;
};
