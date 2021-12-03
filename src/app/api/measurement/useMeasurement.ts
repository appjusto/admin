import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useMeasurement = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutateAsync: setAnalyticsConsent, mutationResult: consentResult } = useCustomMutation(
    async () => api.measurement().setAnalyticsCollectionEnabled(),
    'setAnalyticsConsent'
  );
  // result
  return { setAnalyticsConsent, consentResult };
};
