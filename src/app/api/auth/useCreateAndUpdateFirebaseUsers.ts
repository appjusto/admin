import { useContextApi } from 'app/state/api/context';
import { useMutation } from 'react-query';

export interface EmailAndPassword {
  email: string;
  password: string;
}

export const useCreateAndUpdateFirebaseUsers = () => {
  // contex
  const api = useContextApi();
  // mutations
  const [createUserWithEmailAndPassword, createUserResult] = useMutation((data: EmailAndPassword) =>
    api.auth().createUserWithEmailAndPassword(data.email, data.password)
  );
  const [updateUsersPassword, updateUsersPasswordResult] = useMutation((password: string) =>
    api.auth().updateUsersPassword(password)
  );
  // return
  return {
    createUserWithEmailAndPassword,
    createUserResult,
    updateUsersPassword,
    updateUsersPasswordResult,
  };
};
