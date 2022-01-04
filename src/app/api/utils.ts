import { WithId } from 'appjusto-types';
import { documentsAs, documentAs } from 'core/fb';
import firebase from 'firebase/app';

export const customCollectionSnapshot = <T extends object>(
  query: firebase.firestore.Query<firebase.firestore.DocumentData>,
  resultHandler: (result: WithId<T>[]) => void,
  avoidPenddingWrites = true
) => {
  return query.onSnapshot(
    (snapshot) => {
      // console.log(`%cGet snapshot | docs: ${snapshot.docs?.length}`, 'color: red');
      if (avoidPenddingWrites) {
        if (!snapshot.metadata.hasPendingWrites) {
          // console.log(`%cCall resultHandler`, 'color: purple');
          resultHandler(documentsAs<T>(snapshot.docs));
        }
      } else {
        // console.log(`%cCall resultHandler`, 'color: purple');
        resultHandler(documentsAs<T>(snapshot.docs));
      }
    },
    (error) => {
      console.error(error);
    }
  );
};

export const customDocumentSnapshot = <T extends object>(
  query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
  resultHandler: (result: WithId<T> | null) => void,
  avoidPenddingWrites = true
) => {
  return query.onSnapshot(
    (snapshot) => {
      if (avoidPenddingWrites) {
        if (!snapshot.metadata.hasPendingWrites) {
          if (snapshot.exists) resultHandler(documentAs<T>(snapshot));
          else resultHandler(null);
        }
      } else {
        if (snapshot.exists) resultHandler(documentAs<T>(snapshot));
        else resultHandler(null);
      }
    },
    (error) => {
      console.error(error);
    }
  );
};
