import { WithId } from 'appjusto-types';
import { documentsAs, documentAs } from 'core/fb';
import firebase from 'firebase/app';
import * as Sentry from '@sentry/react';

interface customSnapshotOptions {
  captureException?: boolean;
  avoidPenddingWrites?: boolean;
  monitoring?: boolean;
}

export const customCollectionSnapshot = <T extends object>(
  query: firebase.firestore.Query<firebase.firestore.DocumentData>,
  resultHandler: (result: WithId<T>[]) => void,
  options: customSnapshotOptions = {
    avoidPenddingWrites: true,
  }
) => {
  return query.onSnapshot(
    (snapshot) => {
      if (options.monitoring) console.log('%cSnapshot result!', 'color: blue');
      if (options?.avoidPenddingWrites) {
        if (!snapshot.metadata.hasPendingWrites) {
          resultHandler(documentsAs<T>(snapshot.docs));
        }
      } else {
        resultHandler(documentsAs<T>(snapshot.docs));
      }
    },
    (error) => {
      console.error(error);
      if (options?.captureException) Sentry.captureException(error);
    }
  );
};

export const customDocumentSnapshot = <T extends object>(
  query: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
  resultHandler: (result: WithId<T> | null) => void,
  options: customSnapshotOptions = {
    avoidPenddingWrites: true,
  }
) => {
  return query.onSnapshot(
    (snapshot) => {
      if (options?.avoidPenddingWrites) {
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
      if (options?.captureException) Sentry.captureException(error);
    }
  );
};

// interface customCollectionGetOptions {
//   cacheFirst?: boolean;
// }

// export const customCollectionGet = async <T extends object>(
//   ref: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
//   options?: customCollectionGetOptions
// ) => {
//   let snapshot;
//   if (options?.cacheFirst) {
//     snapshot = await ref.get({ source: 'cache' });
//     if (snapshot.empty) {
//       snapshot = await ref.get({ source: 'server' });
//     }
//   } else {
//     snapshot = await ref.get();
//   }
//   console.log(`fromCach:${snapshot.metadata.fromCache}`);
//   return documentsAs<T>(snapshot.docs);
// };
