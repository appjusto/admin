import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUserEmail } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import { Business } from 'appjusto-types';
import React from 'react';
import { useMutation, useQueryCache, useQuery } from 'react-query';

export const useBusinessProfile = () => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const email = useContextFirebaseUserEmail();
  const queryCache = useQueryCache();
  // queries
  const getBusinessLogoURL = (key: string) => api.business().getBusinessLogoURL(businessId);
  const { data: logo } = useQuery(['business:logo', businessId], getBusinessLogoURL);

  const getBusinessCoverURL = (key: string) =>
    api.business().getBusinessCoverURL(businessId, '1008x360');
  const { data: cover } = useQuery(['business:cover', businessId], getBusinessCoverURL);

  // mutations
  const [createBusinessProfile, createResult] = useMutation(async () => {
    if (email) return api.business().createBusinessProfile(email);
  });
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
  const result =
    createResult ?? updateResult ?? deleteResult ?? uploadLogoResult ?? uploadCoverResult;
  return {
    logo,
    cover,
    createBusinessProfile,
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
