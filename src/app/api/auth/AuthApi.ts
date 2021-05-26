import { ApiConfig } from 'app/api/config/types';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';
import * as Sentry from '@sentry/react';

export default class AuthApi {
  constructor(
    private refs: FirebaseRefs,
    private auth: firebase.auth.Auth,
    private config: ApiConfig
  ) {}

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(handler);
  }

  async sendSignInLinkToEmail(email: string): Promise<void> {
    this.auth.languageCode = 'pt'; // i18n
    try {
      await this.refs.getPlatformLoginLogsRef().add({
        email,
        flavor: 'business',
        signInAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {}
    await this.auth.sendSignInLinkToEmail(email, {
      url: `${this.config.publicURL}/join`,
      handleCodeInApp: true,
    });
    try {
      window.localStorage.setItem('email', email);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  getSignInEmail() {
    try {
      return window.localStorage.getItem('email');
    } catch (error) {
      return null;
    }
  }

  isSignInWithEmailLink(link: string): boolean {
    return this.auth.isSignInWithEmailLink(link);
  }

  async signInWithEmailLink(email: string, link: string) {
    await this.auth.signOut();
    const userCredential = await this.auth.signInWithEmailLink(email, link);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  getUser() {
    return this.auth.currentUser;
  }

  signOut() {
    return this.auth.signOut();
  }

  deleteAccount() {
    return this.refs.getDeleteAccountCallable()();
  }
}
