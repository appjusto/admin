import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUserId } from 'app/state/auth/context';
import { useContextBusinessId } from 'app/state/business/context';
import { EventParams } from 'firebase/analytics';
import { useCustomMutation } from '../mutation/useCustomMutation';

export type AnalyticsLogData = {
  eventName: string;
  eventParams?: EventParams;
};

export const useMeasurement = () => {
  // context
  const api = useContextApi();
  const userId = useContextFirebaseUserId();
  const businessId = useContextBusinessId();
  // mutations
  const { mutate: setAnalyticsConsent, mutationResult: consentResult } =
    useCustomMutation(
      async () => api.measurement().setAnalyticsCollectionEnabled(),
      'setAnalyticsConsent',
      false
    );
  const { mutate: analyticsLogEvent } = useCustomMutation(
    async (data: AnalyticsLogData) => {
      const eventParams = {
        ...data.eventParams,
        businessId,
        userId,
      };
      return api.measurement().analyticsLogEvent(data.eventName, eventParams);
    },
    'analyticsLogEvent',
    false
  );
  // result
  return { setAnalyticsConsent, consentResult, analyticsLogEvent };
};
