import {
  BankAccount,
  Business,
  BusinessStatus,
  Category,
  ChatMessage,
  CreateBusinessProfilePayload,
  UpdateBusinessSlugPayload,
  ManagerProfile,
  MarketplaceAccountInfo,
  Product,
  WithId,
  CloneBusinessPayload,
  RequestWithdrawPayload,
  FetchReceivablesPayload,
  FetchAdvanceSimulationPayload,
  AdvanceReceivablesPayload,
  FetchAccountInformationResponse,
  FetchAccountInformationPayload,
  AccountAdvance,
  AccountWithdraw,
  BusinessMenuMessage,
} from '@appjusto/types';
import { Complement, ComplementGroup, Ordering, ProfileNote } from '@appjusto/types';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import * as Sentry from '@sentry/react';
import {
  IuguMarketplaceAccountAdvanceSimulation,
  IuguMarketplaceAccountReceivables,
} from '@appjusto/types/payment/iugu';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // businesses
  observeBusinesses(
    resultHandler: (
      result: WithId<Business>[],
      last?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    ) => void,
    situations: string[],
    startAfter?: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  ): firebase.Unsubscribe {
    let query = this.refs
      .getBusinessesRef()
      .orderBy('createdOn', 'asc')
      .where('situation', 'in', situations)
      .limit(5);
    if (startAfter) query = query.startAfter(startAfter);
    // returns the unsubscribe function
    return query.onSnapshot(
      (snapshot) => {
        const last = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;
        resultHandler(documentsAs<Business>(snapshot.docs), last);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
  }

  observeBusinessesByStatus(
    status: BusinessStatus,
    resultHandler: (result: WithId<Business>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessesRef().where('status', '==', status);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  // business profile
  observeBusinessProfile(
    businessId: string,
    resultHandler: (result: WithId<Business> | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessRef(businessId);
    // returns the unsubscribe function
    return customDocumentSnapshot(query, resultHandler);
  }

  observeBusinessAdvances(
    businessId: string,
    start: Date,
    end: Date,
    resultHandler: (result: WithId<AccountAdvance>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getAdvancesRef()
      .orderBy('createdOn', 'desc')
      .where('accountId', '==', businessId)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeBusinessWithdraws(
    businessId: string,
    start: Date,
    end: Date,
    resultHandler: (result: WithId<AccountWithdraw>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getWithdrawsRef()
      .orderBy('createdOn', 'desc')
      .where('accountId', '==', businessId)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeBusinessMarketPlace(
    businessId: string,
    resultHandler: (result: MarketplaceAccountInfo | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessMarketPlaceRef(businessId);
    // returns the unsubscribe function
    return customDocumentSnapshot(query, resultHandler);
  }

  async deletePrivateMarketPlace(businessId: string) {
    return await this.refs.getBusinessMarketPlaceRef(businessId).delete();
  }

  async updateChatMessage(orderId: string, messageId: string, changes: Partial<ChatMessage>) {
    await this.refs
      .getOrderChatRef(orderId)
      .doc(messageId)
      .update({
        ...changes,
      } as Partial<ChatMessage>);
  }

  async createBusinessProfile() {
    const payload: CreateBusinessProfilePayload = {
      meta: { version: '1' }, // TODO: pass correct version on
    };
    const business = await this.refs.getCreateBusinessProfileCallable()(payload);
    return business.data as WithId<Business>;
  }

  async cloneBusiness(businessId: string) {
    const payload: CloneBusinessPayload = {
      businessId,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    const business = await this.refs.getCloneBusinessCallable()(payload);
    return business.data as WithId<Business>;
  }

  async updateBusinessSlug(data: { businessId: string; slug: string }) {
    const { businessId, slug } = data;
    const payload: UpdateBusinessSlugPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      businessId,
      slug,
    };
    const result = await this.refs.getUpdateBusinessSlugCallable()(payload);
    return result;
  }

  async updateBusinessProfile(businessId: string, changes: Partial<Business>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    const result = await this.refs.getBusinessRef(businessId).set(fullChanges, { merge: true });
    return result;
  }

  async updateBusinessManagerAndBankAccountBatch(
    businessId: string,
    businessChanges: Partial<Business> | null,
    managerId: string,
    managerChanges: Partial<ManagerProfile> | null,
    bankChanges: Partial<BankAccount> | null
  ) {
    let batch = this.refs.getBatchRef();
    // business
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullBusinessChanges = {
      ...businessChanges,
      updatedOn: timestamp,
    };
    if (businessChanges) batch.update(this.refs.getBusinessRef(businessId), fullBusinessChanges);
    // manager
    if (managerChanges) batch.update(this.refs.getManagerRef(managerId), managerChanges);
    // bank
    if (bankChanges)
      batch.set(this.refs.getBusinessBankAccountRef(businessId), bankChanges, { merge: true });
    // commit
    return batch
      .commit()
      .then(() => true)
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  }

  async updateBusinessProfileWithImages(
    businessId: string,
    changes: Partial<Business>,
    logoFile: File | null,
    coverFiles: File[] | null
  ) {
    //business
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    try {
      await this.refs.getBusinessRef(businessId).set(fullChanges, { merge: true });
      // logo
      if (logoFile) await this.uploadBusinessLogo(businessId, logoFile, () => {});
      //cover
      if (coverFiles) await this.uploadBusinessCover(businessId, coverFiles, () => {});
      // result
      return true;
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
      throw new Error('BusinessUpdateWithImagesError');
    }
  }

  async removeBusinessManager(business: WithId<Business>, managerEmail: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const managers = business.managers?.filter((email) => email !== managerEmail);
    const fullChanges = {
      managers,
      updatedOn: timestamp,
    };
    const result = await this.refs.getBusinessRef(business.id).set(fullChanges, { merge: true });
    return result;
  }

  async sendBusinessKeepAlive(businessId: string) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return await this.refs
      .getBusinessRef(businessId)
      .set({ keepAlive: timestamp }, { merge: true });
  }

  async deleteBusinessProfile(businessId: string) {
    return await this.refs.getBusinessRef(businessId).delete();
  }

  // managers
  observeBusinessManagedBy(
    email: string,
    resultHandler: (result: WithId<Business>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getBusinessesRef()
      .where('managers', 'array-contains', email)
      .orderBy('createdOn', 'desc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  // profile notes
  observeBusinessProfileNotes(
    businessId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessProfileNotesRef(businessId).orderBy('createdOn', 'desc');
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  async createProfileNote(businessId: string, data: Partial<ProfileNote>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getBusinessProfileNotesRef(businessId).add({
      ...data,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as ProfileNote);
  }

  async updateProfileNote(
    businessId: string,
    profileNoteId: string,
    changes: Partial<ProfileNote>
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    await this.refs.getBusinessProfileNoteRef(businessId, profileNoteId).update({
      ...changes,
      updatedOn: timestamp,
    } as Partial<ProfileNote>);
  }

  async deleteProfileNote(businessId: string, profileNoteId: string) {
    await this.refs.getBusinessProfileNoteRef(businessId, profileNoteId).delete();
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
    resultHandler: (result: Ordering) => void,
    menuId?: string
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessMenuOrderingRef(businessId, menuId).onSnapshot(
      (doc) => {
        resultHandler({ ...(doc.data() as Ordering) });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async updateMenuOrdering(businessId: string, ordering: Ordering, menuId?: string) {
    await this.refs.getBusinessMenuOrderingRef(businessId, menuId).set(ordering, { merge: false });
  }

  async addMenuMessage(businessId: string, message: BusinessMenuMessage) {
    return await this.refs.getBusinessMenuMessageRef(businessId).set(message);
  }

  async deleteMenuMessage(businessId: string) {
    return await this.refs.getBusinessMenuMessageRef(businessId).delete();
  }

  async fetchMenuMessage(businessId: string) {
    return (
      await this.refs.getBusinessMenuMessageRef(businessId).get()
    ).data() as BusinessMenuMessage;
  }

  // categories
  observeCategories(
    businessId: string,
    resultHandler: (result: WithId<Category>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessCategoriesRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  createCategoryRef(businessId: string): string {
    return this.refs.getBusinessCategoriesRef(businessId).doc().id;
  }

  async fethCategories(businessId: string) {
    const query = this.refs.getBusinessCategoriesRef(businessId);
    let snapshot = await query.get({ source: 'cache' });
    if (snapshot.empty) {
      snapshot = await query.get({ source: 'server' });
    }
    console.log(snapshot.metadata.fromCache ? '%cfrom Cache' : '%cfrom Server', 'color: red');
    return documentsAs<Category>(snapshot.docs);
    //return customCollectionGet<Category>(query, { cacheFirst: true });
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
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }
  observeProduct(
    businessId: string,
    productId: string,
    resultHandler: (result: WithId<Product>) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessProductRef(businessId, productId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Product>(query, (result) => {
      if (result) resultHandler(result);
    });
  }

  createProductRef(businessId: string): string {
    return this.refs.getBusinessProductsRef(businessId).doc().id;
  }

  async fetchProduct(businessId: string, productId: string) {
    const doc = await this.refs.getBusinessProductRef(businessId, productId).get();
    return documentAs<Product>(doc);
  }

  async createProduct(businessId: string, product: Product, imageFiles?: File[] | null) {
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
    imageFiles?: File[] | null
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

  /////// NEW COMPLEMENTS LOGIC START
  observeComplementsGroups(
    businessId: string,
    resultHandler: (result: WithId<ComplementGroup>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessComplementsGroupsRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler);
  }

  observeComplements(
    businessId: string,
    resultHandler: (result: WithId<Complement>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessComplementsRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(query, resultHandler, {
      avoidPenddingWrites: false,
    });
  }

  async createComplementsGroup(businessId: string, group: ComplementGroup) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const newGroup = {
      ...group,
      enabled: true,
      createdOn: timestamp,
      updatedOn: timestamp,
    };
    return await this.refs.getBusinessComplementsGroupsRef(businessId).add(newGroup);
  }

  async updateComplementsGroup(
    businessId: string,
    groupId: string,
    changes: Partial<ComplementGroup>
  ) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    let changesToSave = changes;
    if (changesToSave.items) delete changesToSave.items;
    await this.refs
      .getBusinessComplementsGroupsRef(businessId)
      .doc(groupId)
      .update({
        ...changesToSave,
        updatedOn: timestamp,
      } as Partial<ComplementGroup>);
  }

  async deleteComplementsGroup(businessId: string, groupId: string) {
    await this.refs.getBusinessComplementsGroupsRef(businessId).doc(groupId).delete();
  }

  async createComplement(businessId: string, item: Complement, imageFile?: File | null) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const complementId = this.refs.getBusinessComplementsRef(businessId).doc().id;
    if (imageFile) {
      await this.uploadComplementPhoto(businessId, complementId, imageFile);
    }
    try {
      await this.refs.getBusinessComplementRef(businessId, complementId).set({
        ...item,
        enabled: true,
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
    item: Partial<Complement>,
    imageFile?: File | null
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

  async deleteComplement(businessId: string, complementId: string) {
    return await this.refs.getBusinessComplementRef(businessId, complementId).delete();
  }

  /////// NEW COMPLEMENTS LOGIC END
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
  // Advances and withdrawls
  async fetchAccountInformation(accountId: string): Promise<FetchAccountInformationResponse> {
    const payload: FetchAccountInformationPayload = {
      accountType: 'business',
      accountId,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getFetchAccountInformationCallable()(payload)).data;
  }
  async requestWithdraw(accountId: string, amount: number): Promise<any> {
    const payload: RequestWithdrawPayload = {
      accountType: 'business',
      accountId,
      amount,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getRequestWithdrawCallable()(payload)).data;
  }
  async fetchReceivables(accountId: string): Promise<IuguMarketplaceAccountReceivables> {
    const payload: FetchReceivablesPayload = {
      accountType: 'business',
      accountId,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getFetchReceivablesCallable()(payload)).data;
  }
  async fetchAdvanceSimulation(
    accountId: string,
    ids: number[]
  ): Promise<IuguMarketplaceAccountAdvanceSimulation> {
    const payload: FetchAdvanceSimulationPayload = {
      accountType: 'business',
      accountId,
      ids,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getFetchAdvanceSimulationCallable()(payload)).data;
  }
  async advanceReceivables(accountId: string, ids: number[]): Promise<any> {
    const payload: AdvanceReceivablesPayload = {
      accountType: 'business',
      accountId,
      ids,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getAdvanceReceivablesCallable()(payload)).data;
  }
}
