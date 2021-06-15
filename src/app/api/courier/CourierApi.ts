import { CourierProfile, Fleet, MarketplaceAccountInfo, WithId } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase';
export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  observeCourierProfile(
    courierId: string,
    resultHandler: (result: WithId<CourierProfile>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getCourierRef(courierId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler({ ...(doc.data() as CourierProfile), id: courierId });
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
