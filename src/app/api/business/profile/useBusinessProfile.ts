import React from 'react';
import { useApi } from "app/state/api/context";
import { useContextBusinessId } from "app/state/business/context";
import { Business } from "appjusto-types";
import { useMutation, useQuery, useQueryCache } from "react-query";

export const useBusinessProfile = () => {
  // context
  const api = useApi();
  const businessId = useContextBusinessId()!;
  const queryCache = useQueryCache();

  // queries
  const getBusinessLogoURL = (key: string) => api.business().getBusinessLogoURL(businessId);
  const { data: logo } = useQuery(['business:logo', businessId], getBusinessLogoURL);

  // mutations
  const [updateBusinessProfile, updateResult] = useMutation(async (changes: Partial<Business>) =>
    api.business().updateBusinessProfile(businessId, changes)
  );
  const [uploadLogo, uploadResult] = useMutation((file: File) =>
    api.business().uploadBusinessLogo(businessId, file)
  );

  const { isSuccess: uploadSuccess } = uploadResult;
  React.useEffect(() => {
    if (uploadSuccess) queryCache.invalidateQueries(['business:logo', businessId]);
  }, [uploadSuccess, queryCache, businessId]);

  // return
  const result = updateResult ?? uploadResult;
  return { logo, updateBusinessProfile, updateResult, uploadLogo, uploadResult, result };
}