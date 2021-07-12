import { CourierProfile, Fleet, MarketplaceAccountInfo, WithId } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from 'core/fb';
import * as Sentry from '@sentry/react';
export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

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

  // courier profile picture
  async getCourierProfilePictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(this.refs.getCourierSelfieStoragePath(courierId, size));
  }

  async getCourierDocumentPictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getCourierDocumentStoragePath(courierId, size)
    );
  }

  // private data
  async getCourierMarketPlaceData(courierId: string) {
    return (
      await this.refs.getCourierMarketPlaceRef(courierId).get()
    ).data() as MarketplaceAccountInfo;
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
}
