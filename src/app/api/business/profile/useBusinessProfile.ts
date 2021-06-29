import { useFirebaseUserRole } from 'app/api/auth/useFirebaseUserRole';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business } from 'appjusto-types';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Sentry from '@sentry/react';

export const useBusinessProfile = () => {
  // context
  const api = useContextApi();
  const { business, setBusinessId } = useContextBusiness();
  const businessId = business?.id;
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

  const sendBusinessKeepAlive = React.useCallback(() => {
    try {
      api.business().sendBusinessKeepAlive(businessId!);
    } catch (error) {
      Sentry.captureException('sendBusinessKeepAliveError', error);
    }
  }, [api, businessId]);

  // return
  return {
    logo,
    cover,
    createBusinessProfile,
    updateBusinessProfile,
    updateBusinessProfileWithImages,
    deleteBusinessProfile,
    updateResult,
    updateWithImagesResult,
    deleteResult,
    sendBusinessKeepAlive,
  };
};
