import { useFirebaseUserRole } from 'app/api/auth/useFirebaseUserRole';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business } from 'appjusto-types';
import React from 'react';
import { useMutation, useQueryCache, useQuery } from 'react-query';
import * as Sentry from '@sentry/react';

export const useBusinessProfile = () => {
  // context
  const api = useContextApi();
  const { business, setBusinessId } = useContextBusiness();
  const businessId = business?.id;
  const queryCache = useQueryCache();
  const { refreshUserToken } = useFirebaseUserRole();

  // queries
  const getBusinessLogoURL = (key: string) =>
    businessId ? api.business().getBusinessLogoURL(businessId!) : null;
  const { data: logo } = useQuery(['business:logo', businessId], getBusinessLogoURL);

  const getBusinessCoverURL = (key: string) =>
    businessId ? api.business().getBusinessCoverURL(businessId!, '1008x360') : null;
  const { data: cover } = useQuery(['business:cover', businessId], getBusinessCoverURL);

  // mutations
  const [createBusinessProfile] = useMutation(async () => {
    const business = await api.business().createBusinessProfile();
    setBusinessId(business.id);
    refreshUserToken();
  });
  const [updateBusinessProfile, updateResult] = useMutation(async (changes: Partial<Business>) =>
    api.business().updateBusinessProfile(businessId!, changes)
  );
  const [deleteBusinessProfile, deleteResult] = useMutation(async () =>
    api.business().deleteBusinessProfile(businessId!)
  );
  const [uploadLogo, uploadLogoResult] = useMutation((file: File) => {
    //api.business().updateBusinessProfile(businessId, { logoExists: false });
    return api.business().uploadBusinessLogo(businessId!, file);
  });
  const [uploadCover, uploadCoverResult] = useMutation((files: File[]) => {
    //api.business().updateBusinessProfile(businessId, { coverImageExists: false });
    return api.business().uploadBusinessCover(businessId!, files);
  });

  const sendBusinessKeepAlive = React.useCallback(() => {
    try {
      api.business().sendBusinessKeepAlive(businessId!);
    } catch (error) {
      Sentry.captureException('sendBusinessKeepAliveError', error);
    }
  }, [businessId]);

  const { isSuccess: uploadSuccess } = uploadLogoResult;
  React.useEffect(() => {
    if (uploadSuccess) queryCache.invalidateQueries(['business:logo', businessId]);
  }, [uploadSuccess, queryCache, businessId]);

  // return

  return {
    logo,
    cover,
    createBusinessProfile,
    updateBusinessProfile,
    deleteBusinessProfile,
    updateResult,
    deleteResult,
    uploadLogo,
    uploadLogoResult,
    uploadCover,
    uploadCoverResult,
    sendBusinessKeepAlive,
  };
};
