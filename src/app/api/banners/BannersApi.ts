import { ClientFlavor, WithId } from '@appjusto/types';
import {
  addDoc,
  deleteDoc,
  onSnapshot,
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
    flavor: ClientFlavor,
    resultHandler: (banners: WithId<Banner>[] | null) => void,
    onlyEnabled?: boolean
  ): Unsubscribe {
    let q = query(this.refs.getBannersRef(), where('flavor', '==', flavor));
    if (onlyEnabled) q = query(q, where('enabled', '==', true));
    // returns the unsubscribe function
    return customCollectionSnapshot<Banner>(q, resultHandler);
  }

  observeBannersOrdering(
    resultHandler: (ordering: BannersOrdering | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBannerOrderingRef();
    // returns the unsubscribe function
    return onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) resultHandler(snapshot.data());
      else resultHandler(null);
    });
  }

  observeBannerById(
    id: string,
    resultHandler: (banners: WithId<Banner> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBannerRef(id);
    // returns the unsubscribe function
    return customDocumentSnapshot<Banner>(ref, resultHandler);
  }

  async updatebannersOrdering(ordering: BannersOrdering) {
    return updateDoc(this.refs.getBannerOrderingRef(), ordering);
  }

  async updateBannerWithImages(
    bannerId: string,
    changes: Partial<Banner>,
    webFile?: File | null,
    mobileFile?: File | null
  ) {
    // banner
    let id = bannerId;
    const flavor = changes.flavor;
    const timestamp = serverTimestamp();
    const createOrUpdateDoc = async () => {
      if (id === 'new') {
        const newDocRef = await addDoc(this.refs.getBannersRef(), {});
        id = newDocRef.id;
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
          return true;
        } catch (error) {
          console.error(error);
          deleteDoc(newDocRef);
          return false;
        }
      } else {
        const fullChanges = {
          ...changes,
          updatedOn: timestamp,
        };
        await updateDoc(this.refs.getBannerRef(id), fullChanges);
        return true;
      }
    };
    const updateResult = await createOrUpdateDoc();
    if (!updateResult) return false;
    // web
    if (webFile && changes.webImageType)
      await this.uploadBannerFiles(
        flavor!,
        id,
        '_980x180',
        webFile,
        changes.webImageType,
        () => {}
      );
    // mobile
    if (mobileFile && changes.mobileImageType)
      await this.uploadBannerFiles(
        flavor!,
        id,
        '_320x100',
        mobileFile,
        changes.mobileImageType,
        () => {}
      );
    // result
    return true;
  }

  async removeBanner(
    bannerId: string,
    flavor: ClientFlavor,
    images: { size: string; type: string }[]
  ) {
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
    this.removeBannerFiles(flavor, bannerId, images);
    return true;
  }

  uploadBannerFiles(
    flavor: ClientFlavor,
    bannerId: string,
    size: string,
    file: File,
    type: string,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      file,
      this.refs.getBannerStoragePath(flavor, bannerId, size, type),
      progressHandler
    );
  }

  removeBannerFiles(
    flavor: ClientFlavor,
    bannerId: string,
    images: {
      size: string;
      type: string;
    }[]
  ) {
    images.forEach((image) => {
      try {
        const imageRef = this.refs.getBannerStoragePath(
          flavor,
          bannerId,
          image.size,
          image.type
        );
        this.files.removeFile(imageRef);
      } catch (error) {
        console.error(error);
      }
    });
  }

  getBannerImageURL(
    flavor: ClientFlavor,
    bannerId: string,
    size: string,
    type?: string
  ) {
    if (!type) return null;
    return this.files.getDownloadURL(
      this.refs.getBannerStoragePath(flavor, bannerId, size, type)
    );
  }
}
