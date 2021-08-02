import { WithId } from 'appjusto-types';
import firebase from 'firebase/app';
import { FirebaseError } from '../app/api/types';

export type FirebaseDocument =
  | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export const documentAs = <T extends object>(doc: FirebaseDocument): WithId<T> => ({
  ...(doc.data() as T),
  id: doc.id,
});

export const documentsAs = <T extends object>(docs: FirebaseDocument[]): WithId<T>[] =>
  docs.map((doc) => documentAs<T>(doc));

export const getErrorMessage = (error: unknown) => {
  if (!error) return null;
  if ((error as FirebaseError).code === 'auth/wrong-password')
    return 'A senha não é válida ou o usuário não possui senha';
  else if ((error as FirebaseError).code === 'auth/too-many-requests')
    return 'O acesso a esta conta, via senha, foi temporariamente desativado devido a muitas tentativas de login. Você pode realizar o login via link imediatamente, ou pode tentar novamente mais tarde.';
  else return (error as FirebaseError).message;
};
