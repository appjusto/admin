import {
  BankAccount,
  Business,
  Category,
  CreateBusinessProfilePayload,
  Product,
  WithId,
} from 'appjusto-types';
import { Complement, ComplementGroup, Ordering } from 'appjusto-types';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';

export const ActiveBusinessesValues = ['approved'];
export const InactiveBusinessesValues = ['pending', 'submitted', 'rejected', 'blocked'];

export type ObserveBusinessesOptions = {
  active?: boolean;
  inactive?: boolean;
};

export default class BusinessApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // businesses
  observeBusinesses(
    situations: string[],
    resultHandler: (result: WithId<Business>[]) => void
  ): firebase.Unsubscribe {
    let query = this.refs
      .getBusinessesRef()
      .orderBy('createdOn', 'asc')
      .where('situation', 'in', situations);

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<Business>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }

  // business profile
  observeBusinessProfile(
    businessId: string,
    resultHandler: (result: WithId<Business> | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessRef(businessId).onSnapshot(
      (doc) => {
        console.log('API:', doc.data());
        if (doc.exists) resultHandler({ ...(doc.data() as Business), id: businessId });
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async createBusinessProfile() {
    const payload: CreateBusinessProfilePayload = {
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getCreateBusinessProfileCallable()(payload)).data as WithId<Business>;
  }

  async updateBusinessProfile(businessId: string, changes: Partial<Business>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    return await this.refs.getBusinessRef(businessId).set(fullChanges, { merge: true });
  }

  async deleteBusinessProfile(businessId: string) {
    return await this.refs.getBusinessRef(businessId).delete();
  }

  async getBusinessPlatformData(businessId: string) {
    const platform = (await this.refs.getBusinessPlatformRef(businessId).get()).data();
    return platform;
  }

  // managers
  observeBusinessManagedBy(
    email: string,
    resultHandler: (result: WithId<Business>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getBusinessesRef()
      .where('managers', 'array-contains', email)
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          resultHandler(documentsAs<Business>(querySnapshot.docs));
        },
        (error) => {
          console.error(error);
        }
      );
    return unsubscribe;
  }

  // bank account
  async fetchBankAccount(businessId: string) {
    const doc = await this.refs.getBusinessBankAccountRef(businessId).get();
    return documentAs<BankAccount>(doc);
  }

  async updateBankAccount(businessId: string, changes: Partial<BankAccount>) {
    await this.refs.getBusinessBankAccountRef(businessId).set(changes, { merge: true });
  }

  // logo
  uploadBusinessLogo(businessId: string, file: File, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      file,
      this.refs.getBusinessLogoUploadStoragePath(businessId),
      progressHandler
    );
  }
  getBusinessLogoURL(businessId: string) {
    return this.files.getDownloadURL(this.refs.getBusinessLogoStoragePath(businessId));
  }

  // cover image
  uploadBusinessCover(
    businessId: string,
    files: File[],
    progressHandler?: (progress: number) => void
  ) {
    const sortedFiles = files.sort((a, b) => b.size - a.size);
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        sortedFiles.map(async (file, index) => {
          await this.files.upload(
            file,
            this.refs.getBusinessCoverUploadStoragePath(
              businessId,
              index === 0 ? '1008x360' : '912x360'
            ),
            progressHandler
          );
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  getBusinessCoverURL(businessId: string, size: string) {
    return this.files.getDownloadURL(this.refs.getBusinessCoverStoragePath(businessId, size));
  }

  // menu config
  observeMenuOrdering(
    businessId: string,
    resultHandler: (result: Ordering) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessMenuOrderingRef(businessId).onSnapshot(
      (doc) => {
        resultHandler({ ...(doc.data() as Ordering) });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async updateMenuOrdering(businessId: string, ordering: Ordering) {
    await this.refs.getBusinessMenuOrderingRef(businessId).set(ordering, { merge: false });
  }

  // categories
  observeCategories(
    businessId: string,
    resultHandler: (result: WithId<Category>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessCategoriesRef(businessId).onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<Category>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  createCategoryRef(businessId: string): string {
    return this.refs.getBusinessCategoriesRef(businessId).doc().id;
  }

  async fetchCategory(businessId: string, categoryId: string) {
    const doc = await this.refs.getBusinessCategoryRef(businessId, categoryId).get();
    return documentAs<Category>(doc);
  }

  async createCategory(businessId: string, categoryId: string, category: Category) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getBusinessCategoryRef(businessId, categoryId).set({
      ...category,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as Category);
  }

  async updateCategory(businessId: string, categoryId: string, changes: Partial<Category>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getBusinessCategoryRef(businessId, categoryId).update({
      ...changes,
      updatedOn: timestamp,
    } as Partial<Category>);
  }

  async deleteCategory(businessId: string, categoryId: string) {
    await this.refs.getBusinessCategoryRef(businessId, categoryId).delete();
  }

  // products
  observeProducts(
    businessId: string,
    resultHandler: (result: WithId<Product>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessProductsRef(businessId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<Product>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }
  observeProduct(
    businessId: string,
    productId: string,
    resultHandler: (result: WithId<Product>) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessProductRef(businessId, productId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Product>(querySnapshot));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  createProductRef(businessId: string): string {
    return this.refs.getBusinessProductsRef(businessId).doc().id;
  }

  async fetchProduct(businessId: string, productId: string) {
    const doc = await this.refs.getBusinessProductRef(businessId, productId).get();
    return documentAs<Product>(doc);
  }

  async createProduct(businessId: string, product: Product, imageFiles: File[] | null) {
    // creating product
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const productId = this.refs.getBusinessProductsRef(businessId).doc().id;
    if (imageFiles) {
      await this.uploadProductPhoto(businessId, productId, imageFiles);
    }
    try {
      await this.refs.getBusinessProductRef(businessId, productId).set({
        ...product,
        createdOn: timestamp,
        updatedOn: timestamp,
      } as Product);
      return productId;
    } catch (error) {
      throw new Error(`createProductError: ${error}`);
    }
  }

  async updateProduct(
    businessId: string,
    productId: string,
    changes: Partial<Product>,
    imageFiles: File[] | null
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    let newProductObject = {};
    if (changes.imageExists) {
      if (imageFiles) {
        await this.uploadProductPhoto(businessId, productId, imageFiles);
      }
      newProductObject = {
        ...changes,
        updatedOn: timestamp,
      };
    } else {
      newProductObject = {
        ...changes,
        updatedOn: timestamp,
      };
    }
    try {
      await this.refs
        .getBusinessProductRef(businessId, productId)
        .set(newProductObject as Partial<Product>, { merge: true });
      return true;
    } catch (error) {
      throw new Error(`updateProductError: ${error}`);
    }
  }

  async deleteProduct(businessId: string, productId: string) {
    await this.refs.getBusinessProductRef(businessId, productId).delete();
  }

  async uploadProductPhoto(
    businessId: string,
    productId: string,
    files: File[],
    progressHandler?: (progress: number) => void
  ) {
    const sortedFiles = files.sort((a, b) => b.size - a.size);
    try {
      sortedFiles.map(async (file, index) => {
        await this.files.upload(
          file,
          this.refs.getProductUploadStoragePath(
            businessId,
            productId,
            index === 0 ? '1008x720' : '288x288'
          ),
          progressHandler
        );
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  getProductImageURL(businessId: string, productId: string, size: string) {
    return this.files.getDownloadURL(
      this.refs.getProductImageStoragePath(businessId, productId, size)
    );
  }

  // complements
  observeComplementsGroups(
    businessId: string,
    productId: string,
    resultHandler: (result: WithId<ComplementGroup>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessProductComplementsGroupsRef(businessId, productId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<ComplementGroup>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }
  observeComplements(
    businessId: string,
    productId: string,
    resultHandler: (result: WithId<Complement>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessProductComplementsRef(businessId, productId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentsAs<Complement>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async createComplementsGroup(businessId: string, productId: string, group: ComplementGroup) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const newGroup = {
      ...group,
      createdOn: timestamp,
      updatedOn: timestamp,
    };
    return await this.refs
      .getBusinessProductComplementsGroupsRef(businessId, productId)
      .add(newGroup);
  }

  async updateComplementsGroup(
    businessId: string,
    productId: string,
    groupId: string,
    changes: Partial<ComplementGroup>
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs
      .getBusinessProductComplementsGroupsRef(businessId, productId)
      .doc(groupId)
      .update({
        ...changes,
        updatedOn: timestamp,
      } as Partial<ComplementGroup>);
  }

  async deleteComplementsGroup(businessId: string, productId: string, groupId: string) {
    await this.refs
      .getBusinessProductComplementsGroupsRef(businessId, productId)
      .doc(groupId)
      .delete();
  }

  async getComplementImageURL(businessId: string, complementId: string) {
    return await this.files.getDownloadURL(
      this.refs.getComplementImageStoragePath(businessId, complementId)
    );
  }

  async uploadComplementPhoto(businessId: string, complementId: string, file: File) {
    try {
      return await this.files.upload(
        file,
        this.refs.getComplementUploadStoragePath(businessId, complementId),
        () => {}
      );
    } catch (error) {
      throw new Error(`uploadComplementPhotoError: ${error}`);
    }
  }

  async createComplement(
    businessId: string,
    productId: string,
    item: Complement,
    imageFile: File | null
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const complementId = this.refs.getBusinessProductComplementsRef(businessId, productId).doc().id;
    if (imageFile) {
      await this.uploadComplementPhoto(businessId, complementId, imageFile);
    }
    try {
      await this.refs.getBusinessProductComplementRef(businessId, productId, complementId).set({
        ...item,
        createdOn: timestamp,
        updatedOn: timestamp,
      } as Complement);
      return complementId;
    } catch (error) {
      throw new Error(`createProductError: ${error}`);
    }
  }

  async updateComplement(
    businessId: string,
    productId: string,
    complementId: string,
    item: Complement,
    imageFile: File | null
  ) {
    let newItem = {
      ...item,
    };
    if (imageFile) {
      await this.uploadComplementPhoto(businessId, complementId, imageFile);
    }
    try {
      return await this.refs
        .getBusinessProductComplementRef(businessId, productId, complementId)
        .update(newItem);
    } catch (error) {
      throw new Error(`updateComplementError: ${error}`);
    }
  }

  async deleteComplement(businessId: string, productId: string, complementId: string) {
    return await this.refs
      .getBusinessProductComplementRef(businessId, productId, complementId)
      .delete();
  }
}
