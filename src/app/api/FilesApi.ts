import { FirebaseStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
export default class FilesApi {
  constructor(private storage: FirebaseStorage) {}

  async upload(file: File, path: string, progressHandler?: (progress: number) => void) {
    return new Promise<boolean>(async (resolve, reject) => {
      const reference = ref(this.storage, path);
      return uploadBytesResumable(reference, file).on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressHandler) progressHandler(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve(true);
        }
      );
    });
  }

  async getDownloadURL(path: string) {
    const reference = ref(this.storage, path);
    const uri = await getDownloadURL(reference)
      .then((res: string | null) => res)
      .catch(() => null);
    return uri;
  }
}
