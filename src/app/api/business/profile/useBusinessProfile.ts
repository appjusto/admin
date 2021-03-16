import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { Business } from 'appjusto-types';
import React from 'react';
import { useMutation, useQueryCache, useQuery } from 'react-query';

export const useBusinessProfile = () => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const queryCache = useQueryCache();
  // queries
  const getBusinessLogoURL = (key: string) => api.business().getBusinessLogoURL(businessId);
  const { data: logo } = useQuery(['business:logo', businessId], getBusinessLogoURL);

  const getBusinessCoverURL = (key: string) =>
    api.business().getBusinessCoverURL(businessId, '1008x360');
  const { data: cover } = useQuery(['business:cover', businessId], getBusinessCoverURL);

  // mutations
  const [updateBusinessProfile, updateResult] = useMutation(async (changes: Partial<Business>) =>
    api.business().updateBusinessProfile(businessId, changes)
  );
  const [deleteBusinessProfile, deleteResult] = useMutation(async () =>
    api.business().deleteBusinessProfile(businessId)
  );
  const [uploadLogo, uploadLogoResult] = useMutation((file: File) => {
    //api.business().updateBusinessProfile(businessId, { logoExists: false });
    return api.business().uploadBusinessLogo(businessId, file);
  });
  const [uploadCover, uploadCoverResult] = useMutation((files: File[]) => {
    //api.business().updateBusinessProfile(businessId, { coverImageExists: false });
    return api.business().uploadBusinessCover(businessId, files);
  });

  const { isSuccess: uploadSuccess } = uploadLogoResult;
  React.useEffect(() => {
    if (uploadSuccess) queryCache.invalidateQueries(['business:logo', businessId]);
  }, [uploadSuccess, queryCache, businessId]);

  // return
  const result = updateResult ?? deleteResult ?? uploadLogoResult ?? uploadCoverResult;
  return {
    logo,
    cover,
    updateBusinessProfile,
    deleteBusinessProfile,
    updateResult,
    uploadLogo,
    uploadLogoResult,
    uploadCover,
    uploadCoverResult,
    result,
  };
};
