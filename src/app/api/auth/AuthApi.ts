import { DeleteAccountPayload, UpdateEmailPayload } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { ApiConfig } from 'app/api/config/types';
import {
  Auth,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  isSignInWithEmailLink,
  reauthenticateWithCredential,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  Unsubscribe,
  updatePassword,
  User,
} from 'firebase/auth';
import { addDoc, serverTimestamp } from 'firebase/firestore/lite';
import FirebaseRefs from '../FirebaseRefs';

export default class AuthApi {
  constructor(private refs: FirebaseRefs, private auth: Auth, private config: ApiConfig) {}

  observeAuthState(handler: (a: User | null) => any): Unsubscribe {
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
    return isSignInWithEmailLink(this.auth, link);
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
      await addDoc(this.refs.getPlatformLoginLogsRef(), {
        email,
        flavor: 'business',
        signInAt: serverTimestamp(),
      });
    } catch (error) {}
    await sendSignInLinkToEmail(this.auth, email, {
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
    const userCredential = await signInWithEmailLink(this.auth, email, link);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await this.auth.signOut();
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await this.auth.signOut();
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    try {
      window.localStorage.removeItem('email');
    } catch (error) {}
    return userCredential.user;
  }

  async updateUsersPassword(password: string, currentPassword?: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not found!');
    if (currentPassword && user.email)
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, currentPassword)
      );
    try {
      await updatePassword(user, password);
    } catch (error) {
      Sentry.captureException(error);
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
