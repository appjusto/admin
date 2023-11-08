import {
  AccountAdvance,
  AccountWithdraw,
  AdvanceReceivablesByAmountPayload,
  BankAccount,
  Business,
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
  FetchAdvanceByAmountSimulationPayload,
  FetchReceivablesPayload,
  HubsterStore,
  ImportMenuPayload,
  MarketplaceAccountInfo,
  Ordering,
  Product,
  ProfileNote,
  ProfileSituation,
  RequestWithdrawPayload,
  UpdateBusinessSlugPayload,
  VRStore,
  WithId,
} from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceByAmountResponse,
  IuguMarketplaceAccountAdvanceByAmountSimulation,
  IuguMarketplaceAccountReceivables,
} from '@appjusto/types/payment/iugu';
import * as Sentry from '@sentry/react';
import { FirebaseError } from 'firebase/app';
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
  where,
} from 'firebase/firestore';
import { omit } from 'lodash';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot, customDocumentSnapshot } from '../utils';
import { ObserveBusinessesManagedByResponse } from './types';
import {
  developmentAdvanceReceivables,
  developmentFetchAccountInformation,
  developmentFetchAdvanceSimulation,
  developmentRequestWithdraw,
} from './utils';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // businesses
  observeBusinesses(
    resultHandler: (
      result: WithId<Business>[],
      last?: QueryDocumentSnapshot<DocumentData>
    ) => void,
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
        const last =
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : undefined;
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
    const q = query(
      this.refs.getBusinessesRef(),
      where('status', '==', status)
    );
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
    const q = query(
      this.refs.getBusinessesRef(),
      where('code', '==', businessCode)
    );
    const businessId = await getDocs(q).then((snapshot) => {
      if (!snapshot.empty) return snapshot.docs[0].id;
      else
        throw new FirebaseError(
          'ignored-error',
          'Não foi possível encontrar o restaurante.'
        );
    });
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

  async cloneComplementsGroup(
    businessId: string,
    groupId: string,
    name?: string
  ) {
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

  async updateBusinessAndBankAccountBatch(
    businessId: string,
    businessChanges: Partial<Business> | null,
    bankChanges: Partial<BankAccount> | null
  ) {
    let batch = this.refs.getBatchRef();
    // business
    const timestamp = serverTimestamp();
    const fullBusinessChanges = {
      ...businessChanges,
      updatedOn: timestamp,
    };
    if (businessChanges)
      batch.update(this.refs.getBusinessRef(businessId), fullBusinessChanges);
    // bank
    if (bankChanges)
      batch.set(this.refs.getBusinessBankAccountRef(businessId), bankChanges, {
        merge: true,
      });
    // commit
    return batch
      .commit()
      .then(() => true)
      .catch((error) => {
        console.log('updateBusinessAndBankAccountBatch error:', error);
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
    if (coverFiles)
      await this.uploadBusinessCover(businessId, coverFiles, () => {});
    // result
    return true;
  }

  async updateBusinessManager(businessId: string, managers: string[]) {
    const timestamp = serverTimestamp();
    const fullChanges = {
      managers,
      updatedOn: timestamp,
    };
    return await updateDoc(this.refs.getBusinessRef(businessId), fullChanges);
  }

  async sendBusinessKeepAlive(businessId: string) {
    try {
      const timestamp = serverTimestamp();
      return await updateDoc(this.refs.getBusinessRef(businessId), {
        keepAlive: timestamp,
      });
    } catch (error) {
      console.log('sendBusinessKeepAlive error: ', error);
      Sentry.captureException(error);
    }
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
  observeBusinessesManagedBy(
    email: string,
    resultHandler: (result: ObserveBusinessesManagedByResponse) => void,
    businessId?: string | null
  ): Unsubscribe {
    const q = query(
      this.refs.getBusinessesRef(),
      where('managers', 'array-contains', email),
      orderBy('createdOn', 'desc')
    );
    // returns the unsubscribe function
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) resultHandler({ current: null, units: null });
        const businesses = documentsAs<Business>(snapshot.docs);
        let current = businesses[0];
        if (businessId && businesses.length > 1) {
          const found = businesses.find(
            (business) => business.id === businessId
          );
          if (found) current = found;
        }
        const units = businesses.map((business) => ({
          id: business.id,
          name: business.name ?? 'Sem nome',
          address: business.businessAddress?.address ?? 'Não informado',
        }));
        resultHandler({ current, units });
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
  }

  // profile notes
  observeBusinessProfileNotes(
    businessId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getBusinessProfileNotesRef(businessId),
      orderBy('createdOn', 'desc')
    );
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
    await updateDoc(
      this.refs.getBusinessProfileNoteRef(businessId, profileNoteId),
      {
        ...changes,
        updatedOn: timestamp,
      } as Partial<ProfileNote>
    );
  }

  async deleteProfileNote(businessId: string, profileNoteId: string) {
    await deleteDoc(
      this.refs.getBusinessProfileNoteRef(businessId, profileNoteId)
    );
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
  uploadBusinessLogo(
    businessId: string,
    file: File,
    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      file,
      this.refs.getBusinessLogoUploadStoragePath(businessId),
      progressHandler
    );
  }
  getBusinessLogoURL(businessId: string) {
    return this.files.getDownloadURL(
      this.refs.getBusinessLogoStoragePath(businessId)
    );
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
    return this.files.getDownloadURL(
      this.refs.getBusinessCoverStoragePath(businessId, size)
    );
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

  async updateMenuOrdering(
    businessId: string,
    ordering: Ordering,
    menuId?: string
  ) {
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

  async createCategory(
    businessId: string,
    categoryId: string,
    category: Category
  ) {
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

  async updateCategory(
    businessId: string,
    categoryId: string,
    changes: Partial<Category>
  ) {
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
    resultHandler: (result: WithId<Product> | null) => void
  ): Unsubscribe {
    const ref = this.refs.getBusinessProductRef(businessId, productId);
    // returns the unsubscribe function
    return customDocumentSnapshot<Product>(ref, resultHandler);
  }

  async fetchProduct(businessId: string, productId: string) {
    const ref = this.refs.getBusinessProductRef(businessId, productId);
    const doc = await getDoc(ref);
    return documentAs<Product>(doc);
  }

  async createProduct(
    businessId: string,
    product: Product,
    imageFiles?: File[] | null
  ) {
    // creating product
    const timestamp = serverTimestamp();
    const productId = this.refs.getBusinessProductNewRef(businessId);
    let image_url_288_288 = null;
    let image_url_1008_720 = null;
    if (imageFiles) {
      const uploadIsSuccess = await this.uploadProductPhoto(
        businessId,
        productId,
        imageFiles
      );
      if (uploadIsSuccess) {
        image_url_288_288 = await this.getProductImageURL(
          businessId,
          productId,
          '288x288'
        );
        image_url_1008_720 = await this.getProductImageURL(
          businessId,
          productId,
          '1008x720'
        );
      }
    }
    try {
      const changes = {
        ...product,
        createdOn: timestamp,
        updatedOn: timestamp,
      } as Product;
      if (image_url_288_288 && image_url_1008_720)
        changes.imageUrls = [image_url_288_288, image_url_1008_720];
      await setDoc(
        this.refs.getBusinessProductRef(businessId, productId),
        changes
      );
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
    let image_url_288_288 = null;
    let image_url_1008_720 = null;
    if (changes.imageExists) {
      if (imageFiles) {
        const uploadIsSuccess = await this.uploadProductPhoto(
          businessId,
          productId,
          imageFiles
        );
        if (uploadIsSuccess) {
          image_url_288_288 = await this.getProductImageURL(
            businessId,
            productId,
            '288x288'
          );
          image_url_1008_720 = await this.getProductImageURL(
            businessId,
            productId,
            '1008x720'
          );
        }
      }
    }
    const newProductObject = {
      ...changes,
      updatedOn: timestamp,
    } as Product;
    if (image_url_288_288 && image_url_1008_720)
      newProductObject.imageUrls = [image_url_288_288, image_url_1008_720];
    try {
      await setDoc(
        this.refs.getBusinessProductRef(businessId, productId),
        newProductObject,
        {
          merge: true,
        }
      );
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
    await deleteDoc(
      this.refs.getBusinessComplementsGroupRef(businessId, groupId)
    );
  }

  async createComplement(
    businessId: string,
    item: Partial<Complement>,
    imageFile?: File | null
  ) {
    const timestamp = serverTimestamp();
    const complementId = this.refs.getBusinessComplementNewRef(businessId);
    const newComplement = {
      ...item,
      enabled: true,
      createdOn: timestamp,
      updatedOn: timestamp,
    } as Complement;
    if (imageFile) {
      const uploadIsSuccess = await this.uploadComplementPhoto(
        businessId,
        complementId,
        imageFile
      );
      if (uploadIsSuccess) {
        const url = await this.getComplementImageURL(businessId, complementId);
        if (url) newComplement.imageUrls = [url];
      }
    }
    try {
      await setDoc(
        this.refs.getBusinessComplementRef(businessId, complementId),
        newComplement
      );
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
    const complementChanges = {
      ...changes,
    } as Partial<Complement>;
    const ref = this.refs.getBusinessComplementRef(businessId, complementId);
    if (imageFile) {
      const uploadIsSuccess = await this.uploadComplementPhoto(
        businessId,
        complementId,
        imageFile
      );
      if (uploadIsSuccess) {
        const url = await this.getComplementImageURL(businessId, complementId);
        if (url) complementChanges.imageUrls = [url];
      }
    }
    try {
      return await updateDoc(ref, complementChanges);
    } catch (error) {
      throw new Error(`updateComplementError: ${error}`);
    }
  }

  async deleteComplement(businessId: string, complementId: string) {
    return await deleteDoc(
      this.refs.getBusinessComplementRef(businessId, complementId)
    );
  }

  /////// NEW COMPLEMENTS LOGIC END
  async getComplementImageURL(businessId: string, complementId: string) {
    return await this.files.getDownloadURL(
      this.refs.getComplementImageStoragePath(businessId, complementId)
    );
  }

  async uploadComplementPhoto(
    businessId: string,
    complementId: string,
    file: File
  ) {
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
    if (process.env.REACT_APP_ENVIRONMENT !== 'live') {
      return await developmentFetchAccountInformation();
    } else {
      return (await this.refs.getFetchAccountInformationCallable()(payload))
        .data as unknown as FetchAccountInformationResponse;
    }
  }
  async requestWithdraw(accountId: string, amount: number): Promise<any> {
    const payload: RequestWithdrawPayload = {
      accountType: 'business',
      accountId,
      amount,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    if (process.env.NODE_ENV === 'development') {
      return await developmentRequestWithdraw(amount);
    } else {
      return (await this.refs.getRequestWithdrawCallable()(payload)).data;
    }
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
  async fetchAdvanceSimulation(accountId: string, amount: number) {
    const payload: FetchAdvanceByAmountSimulationPayload = {
      accountType: 'business',
      accountId,
      amount,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    if (process.env.NODE_ENV === 'development') {
      return await developmentFetchAdvanceSimulation(amount);
    } else {
      return (
        await this.refs.getFetchAdvanceByAmountSimulationCallable()(payload)
      ).data as unknown as IuguMarketplaceAccountAdvanceByAmountSimulation;
    }
  }
  async advanceReceivables(
    accountId: string,
    simulationId: string,
    amount: number,
    fee: number
  ): Promise<any> {
    const payload: AdvanceReceivablesByAmountPayload = {
      accountType: 'business',
      accountId,
      simulationId,
      amount,
      fee,
      meta: { version: '1' }, // TODO: pass correct version on
    };
    if (process.env.NODE_ENV === 'development') {
      return await developmentAdvanceReceivables();
    } else {
      return (await this.refs.getAdvanceReceivablesByAmountCallable()(payload))
        .data as unknown as IuguMarketplaceAccountAdvanceByAmountResponse;
    }
  }
  async importMenu(
    businessId: string,
    url: string,
    discount: number
  ): Promise<unknown> {
    const payload: ImportMenuPayload = {
      meta: { version: '1' }, // TODO: pass correct version on
      url,
      businessId,
      discount,
    };
    return await this.refs.getImportMenuCallable()(payload);
  }
  // integrations
  // hubster
  observeBusinessHubsterStore(
    businessId: string,
    resultHandler: (store: WithId<HubsterStore> | null) => void
  ) {
    const q = query(
      this.refs.getHubsterStoresRef(),
      where('businessId', '==', businessId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) return resultHandler(null);
        const storeDoc = snapshot.docs[0];
        return resultHandler(documentAs<HubsterStore>(storeDoc));
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
  }

  async createHubsterStore(store: HubsterStore) {
    const docRef = this.refs.getHubsterStoresRef();
    return addDoc(docRef, store);
  }
  async updateHubsterStore(docId: string, changes: HubsterStore) {
    const docRef = this.refs.getHubsterStoreRef(docId);
    return updateDoc(docRef, changes);
  }
  // VR
  observeBusinessVrStore(
    businessId: string,
    resultHandler: (store: WithId<VRStore> | null) => void
  ) {
    const q = query(
      this.refs.getVrStoresRef(),
      where('businessId', '==', businessId)
    );
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return resultHandler(null);
      const storeDoc = snapshot.docs[0];
      return resultHandler(documentAs<VRStore>(storeDoc));
    });
  }
}
