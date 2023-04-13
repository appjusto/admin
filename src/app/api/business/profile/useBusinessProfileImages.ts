import { useContextApi } from 'app/state/api/context';
import { useQuery } from 'react-query';

export const useBusinessProfileImages = (businessId?: string) => {
  // context
  const api = useContextApi();
  // queries
  const getBusinessLogoURL = () =>
    businessId ? api.business().getBusinessLogoURL(businessId!) : null;
  const { data: logo } = useQuery(
    ['business_image', { type: 'logo', businessId }],
    getBusinessLogoURL
  );
  const getBusinessCoverURL = () =>
    businessId
      ? api.business().getBusinessCoverURL(businessId!, '1008x360')
      : null;
  const { data: cover } = useQuery(
    ['business_image', { type: 'cover', businessId }],
    getBusinessCoverURL
  );
  // return
  return {
    logo,
    cover,
  };
};
