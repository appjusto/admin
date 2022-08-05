import { PushCampaign, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObservePushCampaign = (campaignId: string) => {
  // contex
  const api = useContextApi();
  // state
  const [campaign, setCampaign] = React.useState<WithId<PushCampaign> | null>();
  // mutations
  const {
    mutate: submitPushCampaign,
    mutationResult: submitPushCampaignResult,
  } = useCustomMutation(
    (data: Partial<PushCampaign>) =>
      api.push_campaign().submitPushCampaign(data),
    'submitPushCampaign'
  );
  const {
    mutate: updatePushCampaign,
    mutationResult: updatePushCampaignResult,
  } = useCustomMutation(
    (data: { campaignId: string; changes: Partial<PushCampaign> }) =>
      api.push_campaign().updatePushCampaign(data.campaignId, data.changes),
    'updatePushCampaign'
  );
  // side effects
  React.useEffect(() => {
    if (!campaignId) return;
    const unsub = api
      .push_campaign()
      .observePushCampaign(campaignId, setCampaign);
    return () => unsub();
  }, [api, campaignId]);
  // return
  return {
    campaign,
    submitPushCampaign,
    updatePushCampaign,
    submitPushCampaignResult,
    updatePushCampaignResult,
  };
};
