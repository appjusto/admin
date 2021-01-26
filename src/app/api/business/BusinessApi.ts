import { BankAccount, Business, Category, Product, WithId } from 'appjusto-types';
import { Complement, ComplementGroup, MenuConfig } from 'appjusto-types/menu';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';

export default class MenuApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // business profile
  observeBusinessProfile(
    businessId: string,
    resultHandler: (result: WithId<Business>) => void
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
    resultHandler: (result: MenuConfig) => void
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
    await this.refs.getBusinessMenuConfigRef(businessId).set(menuConfig, { merge: false });
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

  async deleteCategory(businessId: string, categoryId: string, categoryProducts: string[]) {
    if (categoryProducts?.length > 0) {
      const query = await this.refs
        .getBusinessProductsRef(businessId)
        .where('categoryId', '==', categoryId)
        .get();
      const products = query.docs.map((doc) => ({ id: doc.id, image_url: doc.data().image_url }));
      products.forEach((product) => {
        this.deleteProduct(businessId, product.id, typeof product.image_url === 'string');
      });
    }
    await this.refs.getBusinessCategoryRef(businessId, categoryId).delete();
    return;
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

  async createProduct(businessId: string, product: Product, imageFile: File | null) {
    // creating product
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const productId = this.refs.getBusinessProductsRef(businessId).doc().id;
    if (imageFile) {
      await this.uploadProductPhoto(businessId, productId, imageFile);
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
    imageFile: File | null
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    let newProductObject = {};
    if (changes.imageExists) {
      if (imageFile) {
        await this.uploadProductPhoto(businessId, productId, imageFile);
      }
      newProductObject = {
        ...changes,
        imageExists: false,
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

  async deleteProduct(businessId: string, productId: string, imageExists: boolean) {
    if (imageExists) {
      await this.files.deleteStorageFile(
        this.refs.getProductImageStoragePath(businessId, productId)
      );
    }
    await this.refs.getBusinessProductRef(businessId, productId).delete();
  }

  async uploadProductPhoto(
    businessId: string,
    productId: string,
    file: File,
    progressHandler?: (progress: number) => void
  ) {
    const isSuccess = await this.files.upload(
      file,
      this.refs.getProductUploadStoragePath(businessId, productId),
      progressHandler
    );
    return isSuccess;
  }

  getProductImageURL(businessId: string, productId: string) {
    return this.files.getDownloadURL(this.refs.getProductImageStoragePath(businessId, productId));
  }

  // complements
  observeComplementsGroups(
    businessId: string,
    resultHandler: (result: WithId<ComplementGroup>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessComplementsGroupsRef(businessId);
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
    resultHandler: (result: WithId<Complement>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessComplementsRef(businessId);
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

  async createComplementsGroup(businessId: string, group: ComplementGroup) {
    return await this.refs.getBusinessComplementsGroupsRef(businessId).add(group);
  }

  async updateComplementsGroup(
    businessId: string,
    groupId: string,
    changes: Partial<ComplementGroup>
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs
      .getBusinessComplementsGroupsRef(businessId)
      .doc(groupId)
      .update({
        ...changes,
        updatedOn: timestamp,
      } as Partial<ComplementGroup>);
  }

  async deleteComplementsGroup(businessId: string, groupId: string) {
    await this.refs.getBusinessComplementsGroupsRef(businessId).doc(groupId).delete();
  }

  getComplementImageURL(businessId: string, complementId: string) {
    return this.files.getDownloadURL(
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

  async createComplement(businessId: string, item: Complement, imageFile: File | null) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const complementId = this.refs.getBusinessComplementsRef(businessId).doc().id;
    if (imageFile) {
      await this.uploadComplementPhoto(businessId, complementId, imageFile);
    }
    try {
      await this.refs.getBusinessComplementRef(businessId, complementId).set({
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
      return await this.refs.getBusinessComplementRef(businessId, complementId).update(newItem);
    } catch (error) {
      throw new Error(`updateComplementError: ${error}`);
    }
  }

  async deleteComplement(businessId: string, complementId: string, hasImage: boolean) {
    if (hasImage) {
      await this.files.deleteStorageFile(
        this.refs.getComplementImageStoragePath(businessId, complementId)
      );
    }
    return await this.refs.getBusinessComplementRef(businessId, complementId).delete();
  }
}
