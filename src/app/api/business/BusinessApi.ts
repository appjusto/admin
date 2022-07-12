import {
  AccountAdvance,
  AccountWithdraw,
  AdvanceReceivablesPayload,
  BankAccount,
  Business,
  BusinessAccountManager,
  BusinessMenuMessage,
  BusinessStatus,
  Category,
  CloneBusinessPayload,
  CloneComplementsGroupPayload,
  Complement,
  ComplementGroup,
  CreateBusinessProfilePayload,
  DeleteBusinessPayload,
  FetchAccountInformationPayload,
  FetchAccountInformationResponse,
  FetchAdvanceSimulationPayload,
  FetchReceivablesPayload,
  ManagerProfile,
  MarketplaceAccountInfo,
  Ordering,
  Product,
  ProfileNote,
  ProfileSituation,
  RequestWithdrawPayload,
  UpdateBusinessSlugPayload,
  WithId
} from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceSimulation,
  IuguMarketplaceAccountReceivables
} from '@appjusto/types/payment/iugu';
import * as Sentry from '@sentry/react';
// import firebase from 'firebase/compat/app';
import {
  addDoc,
  deleteDoc,
  DocumentData,
  getDoc,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  Unsubscribe,
  updateDoc,
  where
} from 'firebase/firestore';
import { omit } from 'lodash';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // businesses
  observeBusinesses(
    resultHandler: (result: WithId<Business>[], last?: QueryDocumentSnapshot<DocumentData>) => void,
    situations: ProfileSituation[],
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  ): Unsubscribe {
    let q = query(
      this.refs.getBusinessesRef(),
      orderBy('createdOn', 'asc'),
      where('situation', 'in', situations),
      limit(5)
    );
    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));
    // returns the unsubscribe function
    return onSnapshot(
      q,
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
  ): Unsubscribe {
    const q = query(this.refs.getBusinessesRef(), where('status', '==', status));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  // business profile
  observeBusinessProfile(
    businessId: string,
    resultHandler: (result: WithId<Business> | null) => void
  ): Unsubscribe {
    const query = this.refs.getBusinessRef(businessId);
    // returns the unsubscribe function
    return customDocumentSnapshot(query, resultHandler);
  }

  observeBusinessAdvances(
    businessId: string,
    start: Date,
    end: Date,
    resultHandler: (result: WithId<AccountAdvance>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getAdvancesRef(),
      orderBy('createdOn', 'desc'),
      where('accountId', '==', businessId),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeBusinessWithdraws(
    businessId: string,
    start: Date,
    end: Date,
    resultHandler: (result: WithId<AccountWithdraw>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getWithdrawsRef(),
      orderBy('createdOn', 'desc'),
      where('accountId', '==', businessId),
      where('createdOn', '>=', start),
      where('createdOn', '<=', end)
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  observeBusinessMarketPlace(
    businessId: string,
    resultHandler: (result: MarketplaceAccountInfo | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBusinessMarketPlaceRef(businessId);
    // returns the unsubscribe function
    return customDocumentSnapshot(ref, resultHandler);
  }

  async getBusinessIdByCode(businessCode: string) {
    const q = query(this.refs.getBusinessesRef(), where('code', '==', businessCode));
    const businessId = await getDocs(q).then((snapshot) => snapshot.docs[0].id);
    return businessId;
  }

  async deletePrivateMarketPlace(businessId: string) {
    return await deleteDoc(this.refs.getBusinessMarketPlaceRef(businessId));
  }

  async createBusinessProfile() {
    const payload: CreateBusinessProfilePayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      operation: 'create',
    };
    const business = await this.refs.getBusinessProfileCallable()(payload);
    return business.data as WithId<Business>;
  }

  async cloneBusiness(businessId: string, isFromScratch?: boolean) {
    const payload: CloneBusinessPayload = {
      businessId,
      meta: { version: '1' }, // TODO: pass correct version on
      operation: 'clone',
      isFromScratch,
    };
    const business = await this.refs.getBusinessProfileCallable()(payload);
    return business.data as WithId<Business>;
  }

  async cloneComplementsGroup(businessId: string, groupId: string, name?: string) {
    let payload: CloneComplementsGroupPayload = {
      businessId,
      groupId,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    if (name) payload.name = name;
    const result = await this.refs.getCloneComplementsGroupCallable()(payload);
    return result.data as string;
  }

  async updateBusinessSlug(data: { businessId: string; slug: string }) {
    const { businessId, slug } = data;
    const payload: UpdateBusinessSlugPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      businessId,
      slug,
      operation: 'update-slug',
    };
    const result = await this.refs.getBusinessProfileCallable()(payload);
    return result;
  }

  async updateBusinessProfile(businessId: string, changes: Partial<Business>) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    return await updateDoc(this.refs.getBusinessRef(businessId), fullChanges);
  }

  async updateBusinessAccountManager(businessId: string, managerData: Partial<BusinessAccountManager>) {
    const timestamp = serverTimestamp();
    const accountManager = {
      ...managerData,
      updatedOn: timestamp,
    };
    return await updateDoc(this.refs.getBusinessRef(businessId), { accountManager });
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
    const timestamp = serverTimestamp();
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
    const timestamp = serverTimestamp();
    const fullChanges = {
      ...changes,
      updatedOn: timestamp,
    };
    await updateDoc(this.refs.getBusinessRef(businessId), fullChanges);
    // logo
    if (logoFile) await this.uploadBusinessLogo(businessId, logoFile, () => {});
    //cover
    if (coverFiles) await this.uploadBusinessCover(businessId, coverFiles, () => {});
    // result
    return true;
  }

  async removeBusinessManager(business: WithId<Business>, managerEmail: string) {
    const timestamp = serverTimestamp();
    const managers = business.managers?.filter((email) => email !== managerEmail);
    const fullChanges = {
      managers,
      updatedOn: timestamp,
    };
    return await updateDoc(this.refs.getBusinessRef(business.id), fullChanges);
  }

  async sendBusinessKeepAlive(businessId: string) {
    const timestamp = serverTimestamp();
    return await updateDoc(this.refs.getBusinessRef(businessId), { keepAlive: timestamp });
  }

  async deleteBusinessProfile(data: Partial<DeleteBusinessPayload>) {
    const payload = {
      operation: 'delete',
      meta: { version: '1' }, // TODO: pass correct version on
      ...data,
    } as DeleteBusinessPayload;
    return await this.refs.getBusinessProfileCallable()(payload);
  }

  // managers
  observeBusinessManagedBy(
    email: string,
    resultHandler: (result: WithId<Business>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getBusinessesRef(),
      where('managers', 'array-contains', email),
      orderBy('createdOn', 'desc')
    );
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  // profile notes
  observeBusinessProfileNotes(
    businessId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): Unsubscribe {
    const q = query(this.refs.getBusinessProfileNotesRef(businessId), orderBy('createdOn', 'desc'));
    // returns the unsubscribe function
    return customCollectionSnapshot(q, resultHandler);
  }

  async createProfileNote(businessId: string, data: Partial<ProfileNote>) {
    const timestamp = serverTimestamp();
    await addDoc(this.refs.getBusinessProfileNotesRef(businessId), {
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
    const timestamp = serverTimestamp();
    await updateDoc(this.refs.getBusinessProfileNoteRef(businessId, profileNoteId), {
      ...changes,
      updatedOn: timestamp,
    } as Partial<ProfileNote>);
  }

  async deleteProfileNote(businessId: string, profileNoteId: string) {
    await deleteDoc(this.refs.getBusinessProfileNoteRef(businessId, profileNoteId));
  }

  // bank account
  async fetchBankAccount(businessId: string) {
    const doc = await getDoc(this.refs.getBusinessBankAccountRef(businessId));
    return documentAs<BankAccount>(doc);
  }

  async updateBankAccount(businessId: string, changes: Partial<BankAccount>) {
    await setDoc(this.refs.getBusinessBankAccountRef(businessId), changes);
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
  ): Unsubscribe {
    const ref = this.refs.getBusinessMenuOrderingRef(businessId, menuId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) resultHandler(snapshot.data() as Ordering);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
    return unsubscribe;
  }

  async updateMenuOrdering(businessId: string, ordering: Ordering, menuId?: string) {
    const ref = this.refs.getBusinessMenuOrderingRef(businessId, menuId);
    await setDoc(ref, ordering, { merge: false });
  }

  async addMenuMessage(businessId: string, message: BusinessMenuMessage) {
    const ref = this.refs.getBusinessMenuMessageRef(businessId);
    return await setDoc(ref, message);
  }

  async deleteMenuMessage(businessId: string) {
    const ref = this.refs.getBusinessMenuMessageRef(businessId);
    return await deleteDoc(ref);
  }

  async fetchMenuMessage(businessId: string) {
    const ref = this.refs.getBusinessMenuMessageRef(businessId);
    const data = await getDoc(ref);
    return data.data() as BusinessMenuMessage;
  }

  // categories
  observeCategories(
    businessId: string,
    resultHandler: (result: WithId<Category>[]) => void
  ): Unsubscribe {
    const ref = this.refs.getBusinessCategoriesRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(ref, resultHandler);
  }

  async createCategoryRef(businessId: string): Promise<string> {
    const id = this.refs.getBusinessCategoryNewRef(businessId);
    return id;
  }

  async createCategory(businessId: string, categoryId: string, category: Category) {
    const timestamp = serverTimestamp();
    const ref = this.refs.getBusinessCategoryRef(businessId, categoryId);
    await setDoc(ref, {
      ...category,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as Category);
  }

  async fethCategories(businessId: string) {
    const ref = this.refs.getBusinessCategoriesRef(businessId);
    let snapshot = await getDocsFromCache(ref);
    if (snapshot.empty) {
      snapshot = await getDocsFromServer(ref);
    }
    return documentsAs<Category>(snapshot.docs);
    //return customCollectionGet<Category>(query, { cacheFirst: true });
  }

  async fetchCategory(businessId: string, categoryId: string) {
    const ref = this.refs.getBusinessCategoryRef(businessId, categoryId);
    const doc = await getDoc(ref);
    return documentAs<Category>(doc);
  }

  async updateCategory(businessId: string, categoryId: string, changes: Partial<Category>) {
    const timestamp = serverTimestamp();
    const ref = this.refs.getBusinessCategoryRef(businessId, categoryId);
    await updateDoc(ref, {
      ...changes,
      updatedOn: timestamp,
    } as Partial<Category>);
  }

  async deleteCategory(businessId: string, categoryId: string) {
    const ref = this.refs.getBusinessCategoryRef(businessId, categoryId);
    await deleteDoc(ref);
  }

  // products
  observeProducts(
    businessId: string,
    resultHandler: (result: WithId<Product>[]) => void
  ): Unsubscribe {
    const ref = this.refs.getBusinessProductsRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(ref, resultHandler);
  }
  observeProduct(
    businessId: string,
    productId: string,
    resultHandler: (result: WithId<Product>) => void
  ): Unsubscribe {
    const ref = this.refs.getBusinessProductRef(businessId, productId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Product>(ref, (result) => {
      if (result) resultHandler(result);
    });
  }

  async fetchProduct(businessId: string, productId: string) {
    const ref = this.refs.getBusinessProductRef(businessId, productId);
    const doc = await getDoc(ref);
    return documentAs<Product>(doc);
  }

  async createProduct(businessId: string, product: Product, imageFiles?: File[] | null) {
    // creating product
    const timestamp = serverTimestamp();
    const productId = this.refs.getBusinessProductNewRef(businessId);
    if (imageFiles) {
      await this.uploadProductPhoto(businessId, productId, imageFiles);
    }
    try {
      await setDoc(this.refs.getBusinessProductRef(businessId, productId), {
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
    const timestamp = serverTimestamp();
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
      await setDoc(this.refs.getBusinessProductRef(businessId, productId), newProductObject, {
        merge: true,
      });
      return true;
    } catch (error) {
      throw new Error(`updateProductError: ${error}`);
    }
  }

  async deleteProduct(businessId: string, productId: string) {
    await deleteDoc(this.refs.getBusinessProductRef(businessId, productId));
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
  ): Unsubscribe {
    const ref = this.refs.getBusinessComplementsGroupsRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(ref, resultHandler);
  }

  observeComplements(
    businessId: string,
    resultHandler: (result: WithId<Complement>[]) => void
  ): Unsubscribe {
    const ref = this.refs.getBusinessComplementsRef(businessId);
    // returns the unsubscribe function
    return customCollectionSnapshot(ref, resultHandler, {
      avoidPenddingWrites: false,
    });
  }

  async createComplementsGroup(businessId: string, group: ComplementGroup) {
    const timestamp = serverTimestamp();
    const newGroup = {
      ...group,
      enabled: true,
      createdOn: timestamp,
      updatedOn: timestamp,
    };
    const ref = this.refs.getBusinessComplementsGroupsRef(businessId);
    return await addDoc(ref, newGroup);
  }

  async updateComplementsGroup(
    businessId: string,
    groupId: string,
    changes: Partial<ComplementGroup>
  ) {
    const timestamp = serverTimestamp();
    let changesToSave = omit(changes, 'items');
    const ref = this.refs.getBusinessComplementsGroupRef(businessId, groupId);
    await updateDoc(ref, {
      ...changesToSave,
      updatedOn: timestamp,
    } as Partial<ComplementGroup>);
  }

  async deleteComplementsGroup(businessId: string, groupId: string) {
    await deleteDoc(this.refs.getBusinessComplementsGroupRef(businessId, groupId));
  }

  async createComplement(businessId: string, item: Complement, imageFile?: File | null) {
    const timestamp = serverTimestamp();
    const complementId = this.refs.getBusinessComplementNewRef(businessId);
    if (imageFile) {
      await this.uploadComplementPhoto(businessId, complementId, imageFile);
    }
    try {
      await setDoc(this.refs.getBusinessComplementRef(businessId, complementId), {
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
    changes: Partial<Complement>,
    imageFile?: File | null
  ) {
    // let newItem = {
    //   ...item,
    // };
    const ref = this.refs.getBusinessComplementRef(businessId, complementId);
    if (imageFile) {
      await this.uploadComplementPhoto(businessId, complementId, imageFile);
    }
    try {
      return await updateDoc(ref, changes);
    } catch (error) {
      throw new Error(`updateComplementError: ${error}`);
    }
  }

  async deleteComplement(businessId: string, complementId: string) {
    return await deleteDoc(this.refs.getBusinessComplementRef(businessId, complementId));
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
  async fetchAccountInformation(accountId: string) {
    const payload: FetchAccountInformationPayload = {
      accountType: 'business',
      accountId,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getFetchAccountInformationCallable()(payload))
      .data as unknown as FetchAccountInformationResponse;
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
  async fetchReceivables(accountId: string) {
    const payload: FetchReceivablesPayload = {
      accountType: 'business',
      accountId,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getFetchReceivablesCallable()(payload))
      .data as unknown as IuguMarketplaceAccountReceivables;
  }
  async fetchAdvanceSimulation(accountId: string, ids: number[]) {
    const payload: FetchAdvanceSimulationPayload = {
      accountType: 'business',
      accountId,
      ids,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    return (await this.refs.getFetchAdvanceSimulationCallable()(payload))
      .data as unknown as IuguMarketplaceAccountAdvanceSimulation;
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
