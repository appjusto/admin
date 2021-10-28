import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useMutation } from 'react-query';
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
  const [login, loginResult] = useMutation(async (data: LoginData) => {
    if (data.password) return api.auth().signInWithEmailAndPassword(data.email, data.password);
    else return api.auth().sendSignInLinkToEmail(data.email);
  });
  const [sendSignInLinkToEmail, sendingLinkResult] = useMutation(async (email: string) =>
    api.auth().sendSignInLinkToEmail(email)
  );
  const [signInWithEmailLink, signInResult] = useMutation(async (data: SignInData) =>
    api.auth().signInWithEmailLink(data.email, data.link)
  );
  const updateUsersPassword = (password: string, currentPassword?: string) =>
    api.auth().updateUsersPassword(password, currentPassword);
  const signOut = React.useCallback(() => {
    localStorage.removeItem(`business-${process.env.REACT_APP_ENVIRONMENT}`);
    api.auth().signOut();
  }, [api]);
  const [deleteAccount, deleteAccountResult] = useMutation(async (data: DeleteAccountData) =>
    api.auth().deleteAccount(data)
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
