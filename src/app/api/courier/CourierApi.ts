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
  async getCourierPlatformData(courierId: string) {
    return (await this.refs.getCourierPlatformRef(courierId).get()).data();
  }

  // update
  async updateProfile(id: string, changes: Partial<CourierProfile>) {
    await this.refs.getCourierRef(id).update(changes);
  }
}
