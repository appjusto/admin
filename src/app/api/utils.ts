import { WithId } from 'appjusto-types';
import firebase from 'firebase/app';
import { FirebaseError } from './types';

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
  return (error as FirebaseError).message;
};
