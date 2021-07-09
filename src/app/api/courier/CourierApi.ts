import { CourierProfile, Fleet, MarketplaceAccountInfo, WithId } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase';
import { documentAs, documentsAs } from 'core/fb';
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
    return await this.files.getDownloadURL(
      this.refs.getCourierProfilePictureStoragePath(courierId, size)
    );
  }

  async getCourierDocumentPictureURL(courierId: string, size: string) {
    return await this.files.getDownloadURL(
      this.refs.getCourierDocumentPictureStoragePath(courierId, size)
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

  // update
  async updateProfile(id: string, changes: Partial<CourierProfile>) {
    await this.refs.getCourierRef(id).update(changes);
  }
}
