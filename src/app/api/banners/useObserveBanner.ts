import { ClientFlavor, WithId } from '@appjusto/types';
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
      ? api
          .banners()
          .getBannerImageURL(
            banner.flavor,
            banner.id,
            '_980x180',
            banner.webImageType
          )
      : null;
  const { data: webImage } = useQuery(
    ['banner:web', banner?.id],
    getWebImageURL
  );
  const getMobileImageURL = () =>
    banner?.id
      ? api
          .banners()
          .getBannerImageURL(
            banner.flavor,
            banner.id,
            '_320x100',
            banner.mobileImageType
          )
      : null;
  const { data: mobileImage } = useQuery(
    ['banner:mobile', banner?.id],
    getMobileImageURL
  );
  // mutations
  const { mutate: updateBanner, mutationResult: updateBannerResult } =
    useCustomMutation(
      (data: {
        id: string;
        changes: Partial<Banner>;
        webFile?: File | null;
        mobileFile?: File | null;
      }) => {
        const { id, changes, webFile, mobileFile } = data;
        return api
          .banners()
          .updateBannerWithImages(id, changes, webFile, mobileFile);
      },
      'updateBanner'
    );
  const { mutate: removeBanner, mutationResult: removeBannerResult } =
    useCustomMutation((data: { id: string; flavor: ClientFlavor }) => {
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
    updateBanner,
    updateBannerResult,
    removeBanner,
    removeBannerResult,
  };
};
