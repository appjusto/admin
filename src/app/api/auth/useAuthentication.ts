import { useContextApi } from 'app/state/api/context';
import { nanoid } from 'nanoid';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';
import { FirebaseError } from '../types';
interface LoginData {
  email: string;
  password?: string;
  isLogin?: boolean;
}
interface SignInData {
  email: string;
  link: string;
}
interface DeleteAccountData {
  accountId: string;
}
export const useAuthentication = () => {
  // contex
  const api = useContextApi();
  // mutations
  const { mutateAsync: login, mutationResult: loginResult } = useCustomMutation(
    async (data: LoginData) => {
      const { email, password, isLogin } = data;
      if (isLogin && !password) {
        // let isUserNotFound = false;
        try {
          await api.auth().signInWithEmailAndPassword(email, nanoid(8));
        } catch (error) {
          const { code } = error as FirebaseError;
          if (code === 'auth/user-not-found') {
            // isUserNotFound = true;
            throw new Error('Usuário não encontrado');
          }
        }
      }
      if (password) return api.auth().signInWithEmailAndPassword(email, password);
      else return api.auth().sendSignInLinkToEmail(email);
    },
    'login',
    false,
    false
  );
  const { mutateAsync: sendSignInLinkToEmail, mutationResult: sendingLinkResult } =
    useCustomMutation(
      async (email: string) => api.auth().sendSignInLinkToEmail(email),
      'sendSignInLinkToEmail',
      false,
      false
    );
  const { mutateAsync: signInWithEmailLink, mutationResult: signInResult } = useCustomMutation(
    async (data: SignInData) => api.auth().signInWithEmailLink(data.email, data.link),
    'signInWithEmailLink',
    false,
    false
  );
  const signOut = React.useCallback(
    (email?: string) => {
      if (email) localStorage.removeItem(`business-${process.env.REACT_APP_ENVIRONMENT}-${email}`);
      api.auth().signOut();
    },
    [api]
  );
  const { mutateAsync: deleteAccount, mutationResult: deleteAccountResult } = useCustomMutation(
    async (data: DeleteAccountData) => api.auth().deleteAccount(data),
    'deleteUserAccount'
  );
  // every profile calls it with his mutation
  const updateUsersPassword = (password: string, currentPassword?: string) =>
    api.auth().updateUsersPassword(password, currentPassword);
  // return
  return {
    login,
    loginResult,
    signInWithEmailLink,
    signInResult,
    updateUsersPassword,
    sendSignInLinkToEmail,
    sendingLinkResult,
    signOut,
    deleteAccount,
    deleteAccountResult,
  };
};
