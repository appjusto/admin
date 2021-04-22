import { CourierProfile, WithId } from 'appjusto-types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';

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
  async getCourierPictureURL(courierId: string) {
    return await this.files.getDownloadURL(
      this.refs.getCourierProfilePictureStoragePath(courierId)
    );
  }

  // private data
  async getCourierPlatformData(courierId: string) {
    return (await this.refs.getCourierPlatformRef(courierId).get()).data();
  }
}
