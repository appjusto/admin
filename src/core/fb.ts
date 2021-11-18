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

export const getFirebaseErrorMessage = (error: unknown) => {
  if (!error) return 'Não foi possível acessar o servidor. Tenta novamente?';
  if ((error as FirebaseError).code === 'auth/wrong-password')
    return 'A senha não é válida ou o usuário não possui senha';
  else if ((error as FirebaseError).code === 'auth/invalid-action-code')
    return 'O link de acesso não é válido. Isso pode acontecer caso o link esteja mal formatado, expirado ou já tenha sido utilizado uma vez. Volte para a tela de login e solicite um novo link.';
  else if ((error as FirebaseError).code === 'auth/too-many-requests')
    return 'O acesso a esta conta, via senha, foi temporariamente desativado devido a muitas tentativas de login. Você pode realizar o login via link imediatamente, ou pode tentar novamente mais tarde.';
  else if ((error as FirebaseError).code === 'auth/requires-recent-login')
    return 'Esta operação é sensível e requer autenticação recente. Refaça o login e tente novamente.';
  else if ((error as FirebaseError).code === 'auth/network-request-failed')
    return 'Ocorreu um erro de rede (como tempo limite, conexão interrompida ou host inacessível). Tenta novamente?';
  else return (error as FirebaseError).message;
};
