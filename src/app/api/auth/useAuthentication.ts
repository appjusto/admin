import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';
interface LoginData {
  email: string;
  password?: string;
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
      if (data.password) return api.auth().signInWithEmailAndPassword(data.email, data.password);
      else return api.auth().sendSignInLinkToEmail(data.email);
    },
    'login',
    false,
    false
  );
  const {
    mutateAsync: sendSignInLinkToEmail,
    mutationResult: sendingLinkResult,
  } = useCustomMutation(
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
  const updateUsersPassword = (password: string, currentPassword?: string) =>
    api.auth().updateUsersPassword(password, currentPassword);
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
