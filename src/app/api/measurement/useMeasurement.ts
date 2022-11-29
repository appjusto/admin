import { useContextApi } from 'app/state/api/context';
import { EventParams } from 'firebase/analytics';
import { useCustomMutation } from '../mutation/useCustomMutation';

export type AnalyticsLogData = {
  eventName: string;
  eventParams?: EventParams;
};

export const useMeasurement = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: setAnalyticsConsent, mutationResult: consentResult } =
    useCustomMutation(
      async () => api.measurement().setAnalyticsCollectionEnabled(),
      'setAnalyticsConsent',
      false
    );
  const { mutate: analyticsLogEvent } = useCustomMutation(
    async (data: AnalyticsLogData) =>
      api.measurement().analyticsLogEvent(data.eventName, data.eventParams),
    'analyticsLogEvent',
    false
  );
  // result
  return { setAnalyticsConsent, consentResult, analyticsLogEvent };
};
