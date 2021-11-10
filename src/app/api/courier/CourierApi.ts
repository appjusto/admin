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
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<CourierProfile>(querySnapshot.docs));
        else resultHandler([]);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeCourierProfile(
    courierId: string,
    resultHandler: (result: WithId<CourierProfile> | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getCourierRef(courierId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler(documentAs<CourierProfile>(doc));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeCourierProfileByCode(
    courierCode: string,
    resultHandler: (result: WithId<CourierProfile>[] | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getCouriersRef()
      .where('code', '==', courierCode)
      .onSnapshot(
        (snaptShot) => {
          if (!snaptShot.empty) resultHandler(documentsAs<CourierProfile>(snaptShot.docs));
          else resultHandler(null);
        },
        (error) => {
          console.error(error);
        }
      );
    return unsubscribe;
  }

  observeCourierProfileByName(
    courierName: string,
    resultHandler: (result: WithId<CourierProfile>[] | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getCouriersRef()
      .where('name', '==', courierName)
      .onSnapshot(
        (snaptShot) => {
          if (!snaptShot.empty) resultHandler(documentsAs<CourierProfile>(snaptShot.docs));
          else resultHandler(null);
        },
        (error) => {
          console.error(error);
        }
      );
    return unsubscribe;
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
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<CourierReview>(querySnapshot.docs));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeCourierMarketPlace(
    courierId: string,
    resultHandler: (result: MarketplaceAccountInfo | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getCourierMarketPlaceRef(courierId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler(documentAs<MarketplaceAccountInfo>(doc));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  // profile notes
  observeCourierProfileNotes(
    courierId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getCourierProfileNotesRef(courierId)
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          resultHandler(documentsAs<ProfileNote>(querySnapshot.docs));
        },
        (error) => {
          console.error(error);
        }
      );
    return unsubscribe;
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
