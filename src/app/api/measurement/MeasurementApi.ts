import { Analytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';

export default class MeasurementApi {
  constructor(private analytics: Analytics) {}
  // consent
  setAnalyticsCollectionEnabled() {
    return setAnalyticsCollectionEnabled(this.analytics, true);
  }
}
