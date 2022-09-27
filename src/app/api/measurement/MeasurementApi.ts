import {
  Analytics,
  EventParams,
  logEvent,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';

export default class MeasurementApi {
  constructor(private analytics: Analytics) {}
  // consent
  setAnalyticsCollectionEnabled() {
    return setAnalyticsCollectionEnabled(this.analytics, true);
  }

  trackEvent(eventName: string, params?: EventParams) {
    return logEvent(this.analytics, eventName, params);
  }
}
