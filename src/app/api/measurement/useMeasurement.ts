import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useMeasurement = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: setAnalyticsConsent, mutationResult: consentResult } = useCustomMutation(
    async () => api.measurement().setAnalyticsCollectionEnabled(),
    'setAnalyticsConsent',
    false
  );
  // result
  return { setAnalyticsConsent, consentResult };
};
