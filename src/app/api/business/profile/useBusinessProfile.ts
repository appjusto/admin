import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business } from 'appjusto-types';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Sentry from '@sentry/react';
import { useContextFirebaseUser } from 'app/state/auth/context';

export const useBusinessProfile = () => {
  // context
  const api = useContextApi();
  const { business, setBusinessId } = useContextBusiness();
  const businessId = business?.id;
  const { refreshUserToken } = useContextFirebaseUser();
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
    if (refreshUserToken) refreshUserToken(business.id);
  });
  const [updateBusinessProfile, updateResult] = useMutation(async (changes: Partial<Business>) =>
    api.business().updateBusinessProfile(businessId!, changes)
  );
  const [
    updateBusinessProfileWithImages,
    updateWithImagesResult,
  ] = useMutation(
    async (data: {
      changes: Partial<Business>;
      logoFileToSave: File | null;
      coverFilesToSave: File[] | null;
    }) =>
      api
        .business()
        .updateBusinessProfileWithImages(
          businessId!,
          data.changes,
          data.logoFileToSave,
          data.coverFilesToSave
        )
  );
  const [deleteBusinessProfile, deleteResult] = useMutation(async () =>
    api.business().deleteBusinessProfile(businessId!)
  );
  const [cloneBusiness, cloneResult] = useMutation(async () => {
    const newBusiness = await api.business().cloneBusiness(businessId!);
    if (refreshUserToken && newBusiness?.id) refreshUserToken(newBusiness.id);
    return newBusiness;
  });
  const sendBusinessKeepAlive = React.useCallback(() => {
    try {
      api.business().sendBusinessKeepAlive(businessId!);
    } catch (error) {
      Sentry.captureException('sendBusinessKeepAliveError', error);
    }
  }, [api, businessId]);
  const [updateBusinessSlug, updateSlugResult] = useMutation(
    async (data: { businessId: string; slug: string }) =>
      await api.business().updateBusinessSlug(data)
  );
  // return
  return {
    logo,
    cover,
    createBusinessProfile,
    updateBusinessProfile,
    updateBusinessProfileWithImages,
    updateBusinessSlug,
    deleteBusinessProfile,
    cloneBusiness,
    updateResult,
    updateWithImagesResult,
    updateSlugResult,
    deleteResult,
    cloneResult,
    sendBusinessKeepAlive,
  };
};
