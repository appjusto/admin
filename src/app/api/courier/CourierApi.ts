import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';

export default class CourierApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}
  // courier profile picture
  getCourierPictureURL(courierId: string) {
    return this.files.getDownloadURL(this.refs.getCourierProfilePictureStoragePath(courierId));
  }
}
