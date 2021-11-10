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
} from 'appjusto-types';
import { Complement, ComplementGroup, Ordering, ProfileNote } from 'appjusto-types';
import firebase from 'firebase/app';
import { documentAs, documentsAs } from '../../../core/fb';
import FilesApi from '../FilesApi';
import FirebaseRefs from '../FirebaseRefs';
import { BusinessChatMessage } from './chat/useBusinessChats';
import * as Sentry from '@sentry/react';
import {
  IuguMarketplaceAccountAdvanceSimulation,
  IuguMarketplaceAccountReceivables,
} from 'appjusto-types/payment/iugu';

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

  observeBusinessesByStatus(
    status: BusinessStatus,
    resultHandler: (result: WithId<Business>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs.getBusinessesRef().where('status', '==', status);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) resultHandler(documentsAs<Business>(querySnapshot.docs));
        else resultHandler([]);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  // business profile
  observeBusinessProfile(
    businessId: string,
    resultHandler: (result: WithId<Business> | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessRef(businessId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler(documentAs<Business>(doc));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeBusinessAdvances(
    businessId: string,
    start: Date,
    end: Date,
    resultHandler: (result: WithId<AccountAdvance>[] | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getAdvancesRef()
      .orderBy('createdOn', 'desc')
      .where('accountId', '==', businessId)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    const unsubscribe = query.onSnapshot(
      (data) => {
        if (!data.empty) resultHandler(documentsAs<AccountAdvance>(data.docs));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeBusinessWithdraws(
    businessId: string,
    start: Date,
    end: Date,
    resultHandler: (result: WithId<AccountWithdraw>[] | null) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getWithdrawsRef()
      .orderBy('createdOn', 'desc')
      .where('accountId', '==', businessId)
      .where('createdOn', '>=', start)
      .where('createdOn', '<=', end);
    const unsubscribe = query.onSnapshot(
      (data) => {
        if (!data.empty) resultHandler(documentsAs<AccountWithdraw>(data.docs));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeBusinessChatMessageAsFrom(
    orderId: string,
    businessId: string,
    resultHandler: (orders: WithId<BusinessChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getOrderChatRef(orderId)
      .where('from.id', '==', businessId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          //@ts-ignore
          resultHandler((prev) => {
            const prevFiltered = prev.filter(
              (msg: WithId<BusinessChatMessage>) => msg.orderId !== orderId
            );
            const docs = documentsAs<ChatMessage>(querySnapshot.docs);
            const messages = docs.map((msg) => ({ orderId, ...msg }));
            return [...prevFiltered, ...messages];
          });
        },
        (error) => {
          console.error(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeBusinessChatMessageAsTo(
    orderId: string,
    businessId: string,
    resultHandler: (orders: WithId<BusinessChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getOrderChatRef(orderId)
      .where('to.id', '==', businessId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          //@ts-ignore
          resultHandler((prev) => {
            const prevFiltered = prev.filter(
              (msg: WithId<BusinessChatMessage>) => msg.orderId !== orderId
            );
            const docs = documentsAs<ChatMessage>(querySnapshot.docs);
            const messages = docs.map((msg) => ({ orderId, ...msg }));
            return [...prevFiltered, ...messages];
          });
        },
        (error) => {
          console.error(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  observeBusinessMarketPlace(
    businessId: string,
    resultHandler: (result: MarketplaceAccountInfo | null) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessMarketPlaceRef(businessId).onSnapshot(
      (doc) => {
        if (doc.exists) resultHandler(documentAs<MarketplaceAccountInfo>(doc));
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
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

  // profile notes
  observeBusinessProfileNotes(
    businessId: string,
    resultHandler: (result: WithId<ProfileNote>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs
      .getBusinessProfileNotesRef(businessId)
      .orderBy('createdOn', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          resultHandler(documentsAs<ProfileNote>(querySnapshot.docs));
        },
        (error) => {
          console.error(error);
        }
      );
    return unsubscribe;
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
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          resultHandler(documentsAs<ComplementGroup>(querySnapshot.docs));
        }
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
        if (!querySnapshot.empty) {
          resultHandler(documentsAs<Complement>(querySnapshot.docs));
        }
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
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
