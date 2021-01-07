import { BankAccount, Business, Category, Product, WithId } from 'appjusto-types';
import { MenuConfig } from 'appjusto-types/menu';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirestoreRefs from '../FirebaseRefs';

export default class MenuApi {
  constructor(private refs: FirestoreRefs, private files: FilesApi) {}

  // business profile
  observeBusinessProfile(
    businessId: string,
    resultHandler: (business: WithId<Business>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessRef(businessId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler({ ...(doc.data() as Business), id: businessId });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async createBusinessProfile(managerEmail: string) {
    const doc = this.refs.getBusinessesRef().doc();
    await doc.set({
      situation: 'pending',
      managers: [managerEmail],
      type: 'restaurant',
      status: 'closed',
    } as Partial<Business>);
    return doc.id;
  }

  async updateBusinessProfile(businessId: string, changes: Partial<Business>) {
    await this.refs.getBusinessRef(businessId).set(changes, { merge: true });
  }

  // managers
  observeBusinessManagedBy(
    email: string,
    resultHandler: (categories: WithId<Business>[]) => void
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
    file: File,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      file,
      this.refs.getBusinessCoverUploadStoragePath(businessId),
      progressHandler
    );
  }
  getBusinessCoverURL(businessId: string) {
    return this.files.getDownloadURL(this.refs.getBusinessCoverStoragePath(businessId));
  }

  // menu config
  observeMenuConfig(
    businessId: string,
    resultHandler: (menuConfig: MenuConfig) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessMenuConfigRef(businessId).onSnapshot(
      (doc) => {
        resultHandler({ ...(doc.data() as MenuConfig) });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async updateMenuConfig(businessId: string, menuConfig: MenuConfig) {
    await this.refs.getBusinessMenuConfigRef(businessId).set(menuConfig, { merge: true });
  }

  // categories
  observeCategories(
    businessId: string,
    resultHandler: (categories: WithId<Category>[]) => void
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

  // products
  observeProducts(
    businessId: string,
    resultHandler: (products: WithId<Product>[]) => void
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

  createProductRef(businessId: string): string {
    return this.refs.getBusinessProductsRef(businessId).doc().id;
  }

  async fetchProduct(businessId: string, productId: string) {
    const doc = await this.refs.getBusinessProductRef(businessId, productId).get();
    return documentAs<Product>(doc);
  }

  async createProduct(businessId: string, productId: string, product: Product) {
    // creating product
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getBusinessProductRef(businessId, productId).set({
      ...product,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as Product);
  }

  async updateProduct(businessId: string, productId: string, changes: Partial<Product>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getBusinessProductRef(businessId, productId).update({
      ...changes,
      updatedOn: timestamp,
    } as Partial<Product>);
  }

  uploadProductPhoto(
    businessId: string,
    productId: string,
    file: File,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      file,
      this.refs.getProductUploadStoragePath(businessId, productId),
      progressHandler
    );
  }

  getProductImageURL(businessId: string, productId: string) {
    return this.files.getDownloadURL(this.refs.getProductImageStoragePath(businessId, productId));
  }
}
