import { Flavor, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import React from 'react';
import { useQuery } from 'react-query';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveBanner = (bannerId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [banner, setBanner] = React.useState<WithId<Banner> | null>();
  // queries
  const getWebImageURL = () =>
    banner?.id
      ? api.banners().getBannerImageURL(banner.flavor, banner.id, '980x180')
      : null;
  const { data: webImage } = useQuery(
    ['banner:web', banner?.id],
    getWebImageURL
  );
  const getMobileImageURL = () =>
    banner?.id
      ? api.banners().getBannerImageURL(banner.flavor, banner.id, '320x100')
      : null;
  const { data: mobileImage } = useQuery(
    ['banner:mobile', banner?.id],
    getMobileImageURL
  );
  const getHeroImageURL = () =>
    banner?.id
      ? api.banners().getBannerImageURL(banner.flavor, banner.id, '980x980')
      : null;
  const { data: heroImage } = useQuery(
    ['banner:hero', banner?.id],
    getHeroImageURL
  );
  // mutations
  const { mutate: updateBanner, mutationResult: updateBannerResult } =
    useCustomMutation(
      (data: {
        id: string;
        changes: Partial<Banner>;
        webFiles: File[] | null;
        mobileFiles: File[] | null;
        heroFiles: File[] | null;
      }) => {
        const { id, changes, webFiles, mobileFiles, heroFiles } = data;
        return api
          .banners()
          .updateBannerWithImages(
            id,
            changes,
            webFiles,
            mobileFiles,
            heroFiles
          );
      },
      'updateBanner'
    );
  // mutations
  const { mutate: removeBanner, mutationResult: removeBannerResult } =
    useCustomMutation((data: { id: string; flavor: Flavor }) => {
      const { id, flavor } = data;
      return api.banners().removeBanner(id, flavor);
    }, 'removeBanner');
  // side effects
  React.useEffect(() => {
    if (!bannerId) return;
    api.banners().observeBannerById(bannerId, setBanner);
  }, [api, bannerId]);
  // result
  return {
    banner,
    webImage,
    mobileImage,
    heroImage,
    updateBanner,
    updateBannerResult,
    removeBanner,
    removeBannerResult,
  };
};
