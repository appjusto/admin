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

export const useAuthentication = () => {
  // contex
  const api = useContextApi();
  // mutations
  const [login, loginResult] = useMutation(async (data: LoginData) => {
    if (data.password) return api.auth().signInWithEmailAndPassword(data.email, data.password);
    else return api.auth().sendSignInLinkToEmail(data.email);
  });
  const [signInWithEmailLink, signInResult] = useMutation(async (data: SignInData) =>
    api.auth().signInWithEmailLink(data.email, data.link)
  );
  const updateUsersPassword = (password: string, currentPassword?: string) =>
    api.auth().updateUsersPassword(password, currentPassword);
  const signOut = React.useCallback(() => api.auth().signOut(), [api]);
  // return
  return {
    login,
    loginResult,
    signInWithEmailLink,
    signInResult,
    updateUsersPassword,
    signOut,
  };
};
