import { useContextApi } from 'app/state/api/context';
import { FirebaseError } from 'firebase/app';
import { useCustomMutation } from '../mutation/useCustomMutation';
interface UserCreationData {
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
  // isLogin?: boolean;
}
interface SignInData {
  email: string;
  link: string;
}
interface SignOutData {
  email?: string;
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
      const { email, password } = data;
      try {
        await api.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        throw new FirebaseError('ignored-error', 'E-mail ou senha incorretos.');
      }
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
  const { mutate: signOut, mutationResult: signOutResult } = useCustomMutation(
    (data: SignOutData) => {
      const { email } = data;
      if (email)
        localStorage.removeItem(
          `${email}-${process.env.REACT_APP_ENVIRONMENT}`
        );
      return api.auth().signOut();
    },
    'signOut',
    false
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
    signOutResult,
    deleteAccount,
    deleteAccountResult,
  };
};
