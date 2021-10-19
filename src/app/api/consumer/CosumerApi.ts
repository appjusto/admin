import { WithId, ConsumerProfile } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { documentsAs } from 'core/fb';
import * as Sentry from '@sentry/react';

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeNewConsumers(
    resultHandler: (consumers: WithId<ConsumerProfile>[]) => void,
    start: Date
  ): firebase.Unsubscribe {
    let query = this.refs.getConsumersRef().where('createdOn', '>=', start);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<ConsumerProfile>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeConsumerProfile(
    consumerId: string,
    resultHandler: (result: WithId<ConsumerProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getConsumerRef(consumerId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler({ ...(doc.data() as ConsumerProfile), id: consumerId });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  // consumer profile picture
  async getConsumerProfilePictureURL(consumerId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getConsumerSelfieStoragePath(consumerId, size)
    );
  }

  async getConsumerDocumentPictureURL(consumerId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getConsumerDocumentStoragePath(consumerId, size)
    );
  }

  // selfie
  selfieUpload(consumerId: string, file: File, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      file,
      this.refs.getConsumerSelfieStoragePath(consumerId),
      progressHandler
    );
  }

  // document
  documentUpload(consumerId: string, file: File, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      file,
      this.refs.getConsumerDocumentStoragePath(consumerId),
      progressHandler
    );
  }

  // update
  async updateProfile(
    consumerId: string,
    changes: Partial<ConsumerProfile>,
    selfieFile: File | null,
    documentFile: File | null
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      await this.refs.getConsumerRef(consumerId).update(fullChanges);
      // logo
      if (selfieFile) await this.selfieUpload(consumerId, selfieFile, () => {});
      //cover
      if (documentFile) await this.documentUpload(consumerId, documentFile, () => {});
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
