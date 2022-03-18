import { BusinessRecommendation, ConsumerProfile, ProfileNote, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { documentsAs, FirebaseDocument } from 'core/fb';
import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot, queryLimit } from '../utils';

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeNewConsumers(
    resultHandler: (consumers: WithId<ConsumerProfile>[]) => void,
    start: Date
  ): Unsubscribe {
    const q = query(this.refs.getConsumersRef(), where('createdOn', '>=', start));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeConsumerProfile(
    consumerId: string,
    resultHandler: (result: WithId<ConsumerProfile>) => void
  ): Unsubscribe {
    const ref = this.refs.getConsumerRef(consumerId);
    // returns the unsubscribe function
    return customDocumentSnapshot<ConsumerProfile>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }

  // recommendations
  getRecommendations(
    resultHandler: (
      recommendatios: WithId<BusinessRecommendation>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
    search?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfterDoc?: FirebaseDocument
  ) {
    // query
    let q = query(
      this.refs.getRecommendationsRef(),
      orderBy('createdOn', 'desc'),
      limit(queryLimit)
    );
    // search
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    if (search) q = query(q, where('recommendedBusiness.address.main', '==', search));
    // filters
    if (start && end) q = query(q, where('createdOn', '>=', start), where('createdOn', '<=', end));
    // fetch
    getDocs(q)
      .then((querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<BusinessRecommendation>(querySnapshot.docs), last);
      })
      .catch((error) => {
        console.error(error);
        Sentry.captureException(error);
      });
  }

  async fecthRecommendation(recommendationId: string) {
    return await getDoc(this.refs.getRecommendationRef(recommendationId));
  }

  // profile notes
  observeConsumerProfileNotes(
    consumerId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): Unsubscribe {
    const q = query(this.refs.getConsumerProfileNotesRef(consumerId), orderBy('createdOn', 'desc'));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  async createProfileNote(consumerId: string, data: Partial<ProfileNote>) {
    const timestamp = serverTimestamp();
    await addDoc(this.refs.getConsumerProfileNotesRef(consumerId), {
      ...data,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as ProfileNote);
  }

  async updateProfileNote(
    consumerId: string,
    profileNoteId: string,
    changes: Partial<ProfileNote>
  ) {
    const timestamp = serverTimestamp();
    await updateDoc(this.refs.getConsumerProfileNoteRef(consumerId, profileNoteId), {
      ...changes,
      updatedOn: timestamp,
    } as Partial<ProfileNote>);
  }

  async deleteProfileNote(consumerId: string, profileNoteId: string) {
    await deleteDoc(this.refs.getConsumerProfileNoteRef(consumerId, profileNoteId));
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
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      await updateDoc(this.refs.getConsumerRef(consumerId), fullChanges);
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
