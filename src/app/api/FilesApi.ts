import { FirebaseStorage } from 'firebase/storage';
export default class FilesApi {
  constructor(private storage: FirebaseStorage) {}

  async upload(file: File, path: string, progressHandler?: (progress: number) => void) {
    return new Promise<boolean>(async (resolve, reject) => {
      const ref = this.storage.ref().child(path);
      const task = ref.put(file);
      task.on(
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
    const ref = this.storage.ref().child(path);
    const uri = await ref
      .getDownloadURL()
      .then((res: string | null) => res)
      .catch(() => null);
    return uri;
  }
}
