import { ApiConfig } from 'app/api/config/types';
import firebase from 'firebase/app';
import FirebaseRefs from '../FirebaseRefs';
import * as Sentry from '@sentry/react';
import { DeleteAccountPayload, UpdateEmailPayload } from 'appjusto-types';

export default class AuthApi {
  constructor(
    private refs: FirebaseRefs,
    private auth: firebase.auth.Auth,
    private config: ApiConfig
  ) {}

  observeAuthState(handler: (a: firebase.User | null) => any): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(handler);
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

  getUser() {
    return this.auth.currentUser;
  }

  signOut() {
    return this.auth.signOut();
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

  async signInWithEmailLink(email: string, link: string) {
    await this.auth.signOut();
    const userCredential = await this.auth.signInWithEmailLink(email, link);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await this.auth.signOut();
    const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await this.auth.signOut();
    const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  async updateUsersPassword(password: string, currentPassword?: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not found!');
    if (currentPassword && user.email)
      await user.reauthenticateWithCredential(
        firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)
      );
    try {
      await user.updatePassword(password);
    } catch (error) {
      Sentry.captureException('updateUsersPassword', error);
      throw error;
    }
  }

  async updateEmail(data: { accountId: string; email: string }) {
    const { accountId, email } = data;
    const payload: UpdateEmailPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      accountId,
      email,
    };
    return await this.refs.getUpdateEmailCallable()(payload);
  }

  async deleteAccount(data: { accountId: string }) {
    const { accountId } = data;
    console.log('accountId', accountId);
    const payload: DeleteAccountPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      accountId,
    };
    return this.refs.getDeleteAccountCallable()(payload);
  }
}
