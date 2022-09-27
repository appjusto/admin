import { useContextApi } from 'app/state/api/context';
import { EventParams } from 'firebase/analytics';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useTrackEvent = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: trackEvent } = useCustomMutation(
    async (data: { eventName: string; params: EventParams }) =>
      api.measurement().trackEvent(data.eventName, data.params),
    'trackEvent',
    false
  );
  // result
  return { trackEvent };
};
