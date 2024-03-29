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
  analyticsLogEvent(eventName: string, eventParams?: EventParams) {
    return logEvent(this.analytics, eventName, eventParams);
  }
}
