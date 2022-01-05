import {
  CourierProfile,
  CourierStatus,
  Fleet,
  MarketplaceAccountInfo,
  WithId,
  ReleaseCourierPayload,
  ProfileNote,
} from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from 'core/fb';
import * as Sentry from '@sentry/react';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export type CourierReviewType = 'positive' | 'negative';

export interface CourierReview {
  orderId: string;
  type: CourierReviewType;
  createdOn: firebase.firestore.FieldValue;
  comment?: string;
}
export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeCouriersByStatus(
    statuses: CourierStatus[],
    resultHandler: (result: WithId<CourierProfile>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getCouriersRef().where('status', 'in', statuses);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeCourierProfile(
    courierId: string,
    resultHandler: (result: WithId<CourierProfile> | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getCourierRef(courierId);
    // returns the unsubscribe function
    return customDocumentSnapshot(query, resultHandler);
  }

  observeCourierProfileByCode(
    courierCode: string,
    resultHandler: (result: WithId<CourierProfile>[] | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getCouriersRef().where('code', '==', courierCode);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeCourierProfileByName(
    courierName: string,
    resultHandler: (result: WithId<CourierProfile>[] | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getCouriersRef().where('name', '==', courierName);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeCourierReviews(
    courierId: string,
    types: CourierReviewType[],
    start: Date,
    end: Date,
    resultHandler: (result: WithId<CourierReview>[] | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getCourierReviewsRef(courierId)
      .orderBy('createdOn', 'desc')
      .where('type', 'in', types)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeCourierMarketPlace(
    courierId: string,
    resultHandler: (result: MarketplaceAccountInfo | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getCourierMarketPlaceRef(courierId);
    // returns the unsubscribe function
    return customDocumentSnapshot(query, resultHandler);
  }

  // profile notes
  observeCourierProfileNotes(
    courierId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getCourierProfileNotesRef(courierId).orderBy('createdOn', 'desc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  async createProfileNote(courierId: string, data: Partial<ProfileNote>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getCourierProfileNotesRef(courierId).add({
      ...data,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as ProfileNote);
  }

  async updateProfileNote(courierId: string, profileNoteId: string, changes: Partial<ProfileNote>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getCourierProfileNoteRef(courierId, profileNoteId).update({
      ...changes,
      updatedOn: timestamp,
    } as Partial<ProfileNote>);
  }

  async deleteProfileNote(courierId: string, profileNoteId: string) {
    await this.refs.getCourierProfileNoteRef(courierId, profileNoteId).delete();
  }

  // courier profile picture
  async getCourierProfilePictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(this.refs.getCourierSelfieStoragePath(courierId, size));
  }

  async getCourierDocumentPictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getCourierDocumentStoragePath(courierId, size)
    );
  }

  async getCourierFleet(fleetId: string) {
    const fleet = await this.refs.getFleetRef(fleetId).get();
    return fleet.data() as Fleet;
  }

  // selfie
  selfieUpload(courierId: string, file: File, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      file,
      this.refs.getCourierSelfieStoragePath(courierId),
      progressHandler
    );
  }

  // document
  documentUpload(courierId: string, file: File, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      file,
      this.refs.getCourierDocumentStoragePath(courierId),
      progressHandler
    );
  }

  // update
  async updateProfile(
    courierId: string,
    changes: Partial<CourierProfile>,
    selfieFile: File | null,
    documentFile: File | null
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      await this.refs.getCourierRef(courierId).update(fullChanges);
      // logo
      if (selfieFile) await this.selfieUpload(courierId, selfieFile, () => {});
      //cover
      if (documentFile) await this.documentUpload(courierId, documentFile, () => {});
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async deletePrivateMarketPlace(courierId: string) {
    return await this.refs.getCourierMarketPlaceRef(courierId).delete();
  }

  async releaseCourier(data: { courierId: string; comment: string }) {
    const { courierId, comment } = data;
    const payload: ReleaseCourierPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      courierId,
      comment,
    };
    return await this.refs.getReleaseCourierCallable()(payload);
  }
}
