import { WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentAs, documentsAs } from 'core/fb';
import { DocumentData, DocumentReference, onSnapshot, Query } from 'firebase/firestore';

export const queryLimit = 10;
interface customSnapshotOptions {
  captureException?: boolean;
  avoidPenddingWrites?: boolean;
  monitoring?: boolean;
}

export const customCollectionSnapshot = <T extends object>(
  query: Query<DocumentData>,
  resultHandler: (result: WithId<T>[]) => void,
  options: customSnapshotOptions = {
    avoidPenddingWrites: true,
    captureException: true,
  }
) => {
  return onSnapshot(
    query,
    (snapshot) => {
      if (options.monitoring) console.log('%cGot snapshot result!', 'color: blue');
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
  query: DocumentReference<DocumentData>,
  resultHandler: (result: WithId<T> | null) => void,
  options: customSnapshotOptions = {
    avoidPenddingWrites: true,
    captureException: true,
  }
) => {
  return onSnapshot(
    query,
    (snapshot) => {
      if (options.monitoring) console.log('%cGot snapshot result!', 'color: blue');
      if (options?.avoidPenddingWrites) {
        if (!snapshot.metadata.hasPendingWrites) {
          if (snapshot.exists()) resultHandler(documentAs<T>(snapshot));
          else resultHandler(null);
        }
      } else {
        if (snapshot.exists()) resultHandler(documentAs<T>(snapshot));
        else resultHandler(null);
      }
    },
    (error) => {
      console.error(error);
      if (options?.captureException) Sentry.captureException(error);
    }
  );
};
