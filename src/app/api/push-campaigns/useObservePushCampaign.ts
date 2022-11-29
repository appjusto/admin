import { PushCampaign, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObservePushCampaign = (campaignId?: string) => {
  // contex
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('push_campaigns');
  // state
  const [campaign, setCampaign] = React.useState<WithId<PushCampaign> | null>();
  // mutations
  const {
    mutate: submitPushCampaign,
    mutationResult: submitPushCampaignResult,
  } = useCustomMutation(
    (data: Partial<PushCampaign>) =>
      api.push_campaigns().submitPushCampaign(data),
    'submitPushCampaign'
  );
  const {
    mutate: updatePushCampaign,
    mutationResult: updatePushCampaignResult,
  } = useCustomMutation(
    (data: { campaignId: string; changes: Partial<PushCampaign> }) =>
      api.push_campaigns().updatePushCampaign(data.campaignId, data.changes),
    'updatePushCampaign'
  );
  const {
    mutate: deletePushCampaign,
    mutationResult: deletePushCampaignResult,
  } = useCustomMutation(
    (campaignId: string) => api.push_campaigns().deletePushCampaign(campaignId),
    'deletePushCampaign'
  );
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!campaignId) return;
    const unsub = api
      .push_campaigns()
      .observePushCampaign(campaignId, setCampaign);
    return () => unsub();
  }, [api, userCanRead, campaignId]);
  // return
  return {
    campaign,
    submitPushCampaign,
    updatePushCampaign,
    deletePushCampaign,
    submitPushCampaignResult,
    updatePushCampaignResult,
    deletePushCampaignResult,
  };
};
