import firebase from 'firebase/app';

export default class MeasurementApi {
  constructor(private analytics: firebase.analytics.Analytics) {}
  // consent
  setAnalyticsCollectionEnabled() {
    return this.analytics.setAnalyticsCollectionEnabled(true);
  }
}
