import {
  CourierProfile,
  CourierStatus,
  MarketplaceAccountInfo,
  OrderConsumerReview,
  ProfileNote,
  ReleaseCourierPayload,
  ReviewType,
  WithId,
} from '@appjusto/types';
import * as Sentry from '@sentry/react';
import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeCouriersByStatus(
    statuses: CourierStatus[],
    resultHandler: (result: WithId<CourierProfile>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getCouriersRef(),
      where('status', 'in', statuses)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeCourierProfile(
    courierId: string,
    resultHandler: (result: WithId<CourierProfile> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getCourierRef(courierId);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  observeCourierProfileByCode(
    courierCode: string,
    resultHandler: (result: WithId<CourierProfile>[] | null) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getCouriersRef(),
      where('code', '==', courierCode)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeCourierProfileByName(
    courierName: string,
    resultHandler: (result: WithId<CourierProfile>[] | null) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getCouriersRef(),
      where('name', '==', courierName)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeCourierReviews(
    courierId: string,
    types: ReviewType[],
    start: Date,
    end: Date,
    resultHandler: (result: WithId<OrderConsumerReview>[] | null) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getReviewsRef(),
      orderBy('reviewedOn', 'desc'),
      where('courier.id', '==', courierId),
      where('courier.rating', 'in', types),
      where('reviewedOn', '>=', start),
      where('reviewedOn', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeCourierMarketPlace(
    courierId: string,
    resultHandler: (result: MarketplaceAccountInfo | null) => void
  ): Unsubscribe {
    const ref = this.refs.getCourierMarketPlaceRef(courierId);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  // profile notes
  observeCourierProfileNotes(
    courierId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getCourierProfileNotesRef(courierId),
      orderBy('createdOn', 'desc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  async getCourierIdByCode(courierCode: string) {
    const q = query(
      this.refs.getCouriersRef(),
      where('code', '==', courierCode)
    );
    const courierId = await getDocs(q).then((snapshot) => {
      if (!snapshot.empty) return snapshot.docs[0].id;
      else
        throw new FirebaseError(
          'ignored-error',
          'Não foi possível encontrar o entregador.'
        );
    });
    return courierId;
  }

  async createProfileNote(courierId: string, data: Partial<ProfileNote>) {
    const timestamp = serverTimestamp();
    await addDoc(this.refs.getCourierProfileNotesRef(courierId), {
      ...data,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as ProfileNote);
  }

  async updateProfileNote(
    courierId: string,
    profileNoteId: string,
    changes: Partial<ProfileNote>
  ) {
    const timestamp = serverTimestamp();
    await updateDoc(
      this.refs.getCourierProfileNoteRef(courierId, profileNoteId),
      {
        ...changes,
        updatedOn: timestamp,
      } as Partial<ProfileNote>
    );
  }

  async deleteProfileNote(courierId: string, profileNoteId: string) {
    await deleteDoc(
      this.refs.getCourierProfileNoteRef(courierId, profileNoteId)
    );
  }

  // courier profile picture
  async getCourierProfilePictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getCourierSelfieStoragePath(courierId, size)
    );
  }

  async getCourierDocumentPictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getCourierDocumentStoragePath(courierId, size)
    );
  }

  // selfie
  selfieUpload(
    courierId: string,
    file: File,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      file,
      this.refs.getCourierSelfieStoragePath(courierId),
      progressHandler
    );
  }

  // document
  documentUpload(
    courierId: string,
    file: File,
    progressHandler?: (progress: number) => void
  ) {
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
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      await updateDoc(this.refs.getCourierRef(courierId), fullChanges);
      // logo
      if (selfieFile) await this.selfieUpload(courierId, selfieFile, () => {});
      //cover
      if (documentFile)
        await this.documentUpload(courierId, documentFile, () => {});
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async deletePrivateMarketPlace(courierId: string) {
    return await deleteDoc(this.refs.getCourierMarketPlaceRef(courierId));
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
