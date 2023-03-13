import { useContextApi } from 'app/state/api/context';
import { FirebaseError } from 'firebase/app';
import { nanoid } from 'nanoid';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';
interface UserCreationData {
  email: string;
  password: string;
}
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
  const {
    mutate: createUserWithEmailAndPassword,
    mutationResult: createUserResult,
  } = useCustomMutation(
    async (data: UserCreationData) => {
      try {
        const { email, password } = data;
        const newUser = await api
          .auth()
          .createUserWithEmailAndPassword(email, password);
        return newUser;
      } catch (error) {
        const { code } = error as FirebaseError;
        if (code === 'auth/email-already-in-use') {
          // if user not exists return error
          throw new FirebaseError(
            'user-creation-email-already-in-use-error',
            'O email informado já foi cadastrado.'
          );
        }
        throw new FirebaseError(
          'user-creation-error',
          `Não foi possível criar o usuário (${code})`
        );
      }
    },
    'createUserWithEmailAndPassword',
    true,
    false
  );
  const { mutate: login, mutationResult: loginResult } = useCustomMutation(
    async (data: LoginData) => {
      const { email, password, isLogin } = data;
      if (isLogin && !password) {
        // if user is trying to login with email link
        // check if the user exists
        try {
          await api.auth().signInWithEmailAndPassword(email, nanoid(8));
        } catch (error) {
          const { code } = error as FirebaseError;
          if (code === 'auth/user-not-found') {
            // if user not exists return error
            throw new FirebaseError(
              'ignored-error',
              'Não foi possível enviar o link de acesso para o e-mail informado.'
            );
          }
        }
      }
      if (password) {
        try {
          await api.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
          throw new FirebaseError(
            'ignored-error',
            'E-mail ou senha incorretos.'
          );
        }
      } else return api.auth().sendSignInLinkToEmail(email);
    },
    'login',
    false,
    false
  );
  const { mutate: sendSignInLinkToEmail, mutationResult: sendingLinkResult } =
    useCustomMutation(
      (email: string) => api.auth().sendSignInLinkToEmail(email),
      'sendSignInLinkToEmail',
      false,
      false
    );
  const { mutate: signInWithEmailLink, mutationResult: signInResult } =
    useCustomMutation(
      (data: SignInData) =>
        api.auth().signInWithEmailLink(data.email, data.link),
      'signInWithEmailLink',
      false,
      false
    );
  const signOut = React.useCallback(
    (email?: string) => {
      if (email)
        localStorage.removeItem(
          `${email}-${process.env.REACT_APP_ENVIRONMENT}`
        );
      api.auth().signOut();
    },
    [api]
  );
  const { mutate: deleteAccount, mutationResult: deleteAccountResult } =
    useCustomMutation(
      (data: DeleteAccountData) => api.auth().deleteAccount(data),
      'deleteUserAccount'
    );
  // every profile calls it with his mutation
  const updateUsersPassword = (password: string, currentPassword?: string) =>
    api.auth().updateUsersPassword(password, currentPassword);
  // return
  return {
    createUserWithEmailAndPassword,
    createUserResult,
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
