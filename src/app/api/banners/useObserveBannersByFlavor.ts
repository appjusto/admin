import { ClientFlavor, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { getBannersByFlavorOrdered } from 'pages/backoffice/banners/utils';
import { Banner, BannersOrdering } from 'pages/backoffice/drawers/banner/types';
import React from 'react';

export const useObserveBannersByFlavor = (
  flavor: ClientFlavor,
  getImages?: boolean
) => {
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
    api.banners().observeBannersByFlavor(flavor, async (data) => {
      if (data) {
        const ordered = getBannersByFlavorOrdered(ordering[flavor], data);
        if (getImages) {
          const orderedWithImages = await Promise.all(
            ordered.map(async (item) => {
              const images = [];
              const mobile = await api
                .banners()
                .getBannerImageURL(flavor, item.id, '320x100');
              const web = await api
                .banners()
                .getBannerImageURL(flavor, item.id, '980x180');
              images.push(mobile);
              images.push(web);
              return { ...item, images };
            })
          );
          setBanners(orderedWithImages);
        } else {
          setBanners(ordered);
        }
      } else setBanners(data);
    });
  }, [api, ordering, flavor, getImages]);
  // result
  return banners;
};
