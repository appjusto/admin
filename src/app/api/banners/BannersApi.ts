import { Flavor, WithId } from '@appjusto/types';
import {
  addDoc,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { Banner } from 'pages/backoffice/drawers/banner/types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class BannersApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  observeBanners(
    resultHandler: (banners: WithId<Banner>[] | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBannersRef();
    // returns the unsubscribe function
    return customCollectionSnapshot<Banner>(ref, resultHandler);
  }

  observeBannerById(
    id: string,
    resultHandler: (banners: WithId<Banner> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBannerRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot<Banner>(ref, resultHandler);
  }

  async updateBannerWithImages(
    bannerId: string,
    changes: Partial<Banner>,
    webFiles: File[] | null,
    mobileFiles: File[] | null,
    heroFiles: File[] | null
  ) {
    // banner
    let id = bannerId;
    const flavor = changes.flavor;
    const timestamp = serverTimestamp();
    if (id === 'new') {
      const fullChanges = {
        ...changes,
        createdOn: timestamp,
        updatedOn: timestamp,
      };
      const newDoc = await addDoc(this.refs.getBannersRef(), fullChanges);
      id = newDoc.id;
    } else {
      const fullChanges = {
        ...changes,
        updatedOn: timestamp,
      };
      await updateDoc(this.refs.getBannerRef(id), fullChanges);
    }
    // web
    if (webFiles)
      await this.uploadBannerFiles(
        flavor!,
        id,
        '980x180',
        webFiles[0],
        () => {}
      );
    // mobile
    if (mobileFiles)
      await this.uploadBannerFiles(
        flavor!,
        id,
        '320x100',
        mobileFiles[0],
        () => {}
      );
    // hero
    if (heroFiles)
      await this.uploadBannerFiles(
        flavor!,
        id,
        '980x980',
        heroFiles[0],
        () => {}
      );
    // result
    return true;
  }

  uploadBannerFiles(
    flavor: Flavor,
    bannerId: string,
    size: string,
    file: File,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      file,
      this.refs.getBannerStoragePath(flavor, bannerId, size),
      progressHandler
    );
  }

  getBannerImageURL(flavor: Flavor, bannerId: string, size: string) {
    return this.files.getDownloadURL(
      this.refs.getBannerStoragePath(flavor, bannerId, size)
    );
  }
}
