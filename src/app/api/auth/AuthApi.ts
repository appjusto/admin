import { ApiConfig } from 'app/api/config/types';
import firebase from 'firebase/app';

export default class AuthApi {
  constructor(
    private auth: firebase.auth.Auth,
    private functions: firebase.functions.Functions,
    private config: ApiConfig
  ) {}

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(handler);
  }

  async sendSignInLinkToEmail(email: string): Promise<void> {
    this.auth.languageCode = 'pt'; // i18n
    await this.auth.sendSignInLinkToEmail(email, {
      url: `${this.config.publicURL}/join`,
      handleCodeInApp: true,
    });
    window.localStorage.setItem('email', email);
  }

  getSignInEmail() {
    return window.localStorage.getItem('email');
  }

  isSignInWithEmailLink(link: string): boolean {
    return this.auth.isSignInWithEmailLink(link);
  }

  async signInWithEmailLink(email: string, link: string) {
    const userCredential = await this.auth.signInWithEmailLink(email, link);
    window.localStorage.removeItem('email');
    return userCredential.user;
  }

  getUser() {
    return this.auth.currentUser;
  }

  signOut() {
    return this.auth.signOut();
  }

  deleteAccount() {
    return this.functions.httpsCallable('deleteAccount')();
  }
}
