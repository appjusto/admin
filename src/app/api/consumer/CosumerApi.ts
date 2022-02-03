import { WithId, ConsumerProfile, BusinessRecommendation, ProfileNote } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { documentsAs, FirebaseDocument } from 'core/fb';
import * as Sentry from '@sentry/react';
import { customCollectionSnapshot, customDocumentSnapshot, queryLimit } from '../utils';

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeNewConsumers(
    resultHandler: (consumers: WithId<ConsumerProfile>[]) => void,
    start: Date
  ): firebase.Unsubscribe {
    const query = this.refs.getConsumersRef().where('createdOn', '>=', start);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeConsumerProfile(
    consumerId: string,
    resultHandler: (result: WithId<ConsumerProfile>) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getConsumerRef(consumerId);
    // returns the unsubscribe function
    return customDocumentSnapshot<ConsumerProfile>(query, (result) => {
      if (result) resultHandler(result);
    });
  }

  observeRecommendations(
    resultHandler: (
      recommendatios: WithId<BusinessRecommendation>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    search?: string | null,
    start?: Date | null,
    end?: Date | null,
    startAfter?: FirebaseDocument
  ): firebase.Unsubscribe {
    //console.log({
    //  searchType: searchType,
    //  search: search,
    //  isBlocked: isBlocked,
    //  start: start,
    //  end: end,
    //});
    // query
    let query = this.refs.getRecommendationsRef().orderBy('createdOn', 'desc').limit(queryLimit);
    // search
    if (startAfter) query = query.startAfter(startAfter);
    if (search) query = query.where('recommendedBusiness.address.main', '==', search);
    // filters
    if (start && end) query = query.where('createdOn', '>=', start).where('createdOn', '<=', end);
    // observer
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const last =
          querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.size - 1] : undefined;
        resultHandler(documentsAs<BusinessRecommendation>(querySnapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async fecthRecommendation(recommendationId: string) {
    return await this.refs.getRecommendationRef(recommendationId).get();
  }

  // profile notes
  observeConsumerProfileNotes(
    consumerId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getConsumerProfileNotesRef(consumerId).orderBy('createdOn', 'desc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  async createProfileNote(consumerId: string, data: Partial<ProfileNote>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getConsumerProfileNotesRef(consumerId).add({
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
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getConsumerProfileNoteRef(consumerId, profileNoteId).update({
      ...changes,
      updatedOn: timestamp,
    } as Partial<ProfileNote>);
  }

  async deleteProfileNote(consumerId: string, profileNoteId: string) {
    await this.refs.getConsumerProfileNoteRef(consumerId, profileNoteId).delete();
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
