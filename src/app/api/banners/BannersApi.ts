import { Flavor, WithId } from '@appjusto/types';
import {
  addDoc,
  deleteDoc,
  query,
  runTransaction,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Banner, BannersOrdering } from 'pages/backoffice/drawers/banner/types';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class BannersApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  observeBannersByFlavor(
    flavor: Flavor,
    resultHandler: (banners: WithId<Banner>[] | null) => void
  ): Unsubscribe {
    const q = query(this.refs.getBannersRef(), where('flavor', '==', flavor));
    // returns the unsubscribe function
    return customCollectionSnapshot<Banner>(q, resultHandler);
  }

  observeBannerById(
    id: string,
    resultHandler: (banners: WithId<Banner> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBannerRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot<Banner>(ref, resultHandler);
  }

  async removeBanner(bannerId: string, flavor: Flavor) {
    await runTransaction(this.refs.getFirestoreRef(), async (transaction) => {
      const orderingRef = this.refs.getBannerOrderingRef();
      const orderingSnapshot = await transaction.get(orderingRef);
      const ordering = orderingSnapshot.data() as BannersOrdering;
      const newOrdering = {
        ...ordering,
        [flavor]: ordering[flavor].filter((item) => item !== bannerId),
      };
      transaction.set(orderingRef, newOrdering);
      transaction.delete(this.refs.getBannerRef(bannerId));
    });
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
      const newDocRef = await addDoc(this.refs.getBannersRef(), {});
      try {
        await runTransaction(
          this.refs.getFirestoreRef(),
          async (transaction) => {
            const orderingRef = this.refs.getBannerOrderingRef();
            let ordering: BannersOrdering = {
              consumer: [],
              business: [],
              courier: [],
            };
            const orderingSnapshot = await transaction.get(orderingRef);
            if (orderingSnapshot.exists()) {
              console.log('Using saved ordering');
              ordering = orderingSnapshot.data() as BannersOrdering;
            }
            const fullChanges = {
              ...changes,
              createdOn: timestamp,
              updatedOn: timestamp,
            };
            transaction.set(newDocRef, fullChanges);
            id = newDocRef.id;
            ordering[flavor as string].push(id);
            transaction.set(orderingRef, ordering);
          }
        );
      } catch (error) {
        deleteDoc(newDocRef);
      }
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
