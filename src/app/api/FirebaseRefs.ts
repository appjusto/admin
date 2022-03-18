import { collection, doc, Firestore, writeBatch } from 'firebase/firestore';
import { Functions, httpsCallable } from 'firebase/functions';
export default class FirebaseRefs {
  constructor(private functions: Functions, private firestore: Firestore) {}

  // functions
  getServerTimeCallable = () => httpsCallable(this.functions, 'getServerTime');
  getQueryGoogleMapsCallable = () => httpsCallable(this.functions, 'queryGoogleMaps');
  getUpdateEmailCallable = () => httpsCallable(this.functions, 'updateEmail');
  getDeleteAccountCallable = () => httpsCallable(this.functions, 'deleteAccount');
  getCreateBusinessProfileCallable = () => httpsCallable(this.functions, 'createBusinessProfile');
  getUpdateBusinessSlugCallable = () => httpsCallable(this.functions, 'updateBusinessSlug');
  getCloneBusinessCallable = () => httpsCallable(this.functions, 'cloneBusiness');
  getCloneComplementsGroupCallable = () => httpsCallable(this.functions, 'cloneComplementsGroup');
  getCreateManagersCallable = () => httpsCallable(this.functions, 'createManagers');
  getGetBusinessManagersCallable = () => httpsCallable(this.functions, 'getBusinessManagers');
  getCancelOrderCallable = () => httpsCallable(this.functions, 'cancelOrder');
  getMatchOrderCallable = () => httpsCallable(this.functions, 'matchOrder');
  getDropOrderCallable = () => httpsCallable(this.functions, 'dropOrder');
  getOutsourceDeliveryCallable = () => httpsCallable(this.functions, 'outsourceDelivery');
  getReleaseCourierCallable = () => httpsCallable(this.functions, 'releaseCourier');
  getFetchAccountInformationCallable = () =>
    httpsCallable(this.functions, 'fetchAccountInformation');
  getFetchReceivablesCallable = () => httpsCallable(this.functions, 'fetchReceivables');
  getFetchAdvanceSimulationCallable = () => httpsCallable(this.functions, 'fetchAdvanceSimulation');
  getRequestWithdrawCallable = () => httpsCallable(this.functions, 'requestWithdraw');
  getAdvanceReceivablesCallable = () => httpsCallable(this.functions, 'advanceReceivables');

  // firestore
  getBatchRef = () => writeBatch(this.firestore);
  // users
  getUsersRef = () => collection(this.firestore, 'users');

  getUsersChangesRef = () => collection(this.firestore, 'users', 'subcollections', 'changes');

  // advances
  getAdvancesRef = () => collection(this.firestore, 'advances');

  // withdraws
  getWithdrawsRef = () => collection(this.firestore, 'withdraws');

  // platform
  getPlatformRef = () => collection(this.firestore, 'platform');

  // platform docs
  getPlatformParamsRef = () => doc(this.firestore, 'platform', 'params');
  getPlatformStatisticsRef = () => doc(this.firestore, 'platform', 'statistics');
  getPlatformDatasRef = () => doc(this.firestore, 'platform', 'data');
  getPlatformLogsRef = () => doc(this.firestore, 'platform', 'logs');
  getPlatformAccessRef = () => doc(this.firestore, 'platform', 'access');
  // fraud prevention
  getFraudPreventionRef = () => doc(this.firestore, 'platform', 'fraud');
  getFraudPreventionSubdocsRef = () => collection(this.firestore, 'platform', 'fraud', 'subdocs');
  getFraudPreventionParamsRef = () => doc(this.firestore, 'platform', 'fraud', 'subdocs', 'params');

  // STOP UPDATE HERE <<<
  getFlaggedLocationsRef = () => collection(this.getFraudPreventionRef(), 'flaggedlocations');
  getFlaggedLocationRef = (locationId: string) => doc(this.getFlaggedLocationsRef(), locationId);

  // platform data subcollections
  getBanksRef = () => this.getPlatformDatasRef().collection('banks');
  getIssuesRef = () => this.getPlatformDatasRef().collection('issues');
  getCuisinesRef = () => this.getPlatformDatasRef().collection('cuisines');
  getClassificationsRef = () => this.getPlatformDatasRef().collection('classifications');

  // platform logs subcollections
  getPlatformLoginLogsRef = () => this.getPlatformLogsRef().collection('logins');

  // businesses
  getBusinessesRef = (stopMonitoring?: boolean) => {
    return this.firestore.collection('businesses');
  };
  getBusinessRef = (id: string, child?: string) => {
    return this.getBusinessesRef(true).doc(id);
  };
  getBusinessProfileNotesRef = (id: string) =>
    this.getBusinessRef(id, 'profilenotes').collection('profilenotes');
  getBusinessProfileNoteRef = (businessId: string, profileNoteId: string) =>
    this.getBusinessProfileNotesRef(businessId).doc(profileNoteId);

  // business menu
  getBusinessMenuRef = (businessId: string) =>
    this.getBusinessRef(businessId, 'menu').collection('menu');
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    this.getBusinessMenuRef(businessId).doc(menuId);
  getBusinessMenuMessageRef = (businessId: string) =>
    this.getBusinessMenuRef(businessId).doc('message');
  getBusinessCategoriesRef = (businessId: string) =>
    this.getBusinessRef(businessId, 'categories').collection('categories');
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    this.getBusinessCategoriesRef(businessId).doc(categoryId);
  getBusinessProductsRef = (businessId: string) =>
    this.getBusinessRef(businessId, 'products').collection('products');
  getBusinessProductRef = (businessId: string, id: string) =>
    this.getBusinessProductsRef(businessId).doc(id);
  getBusinessProductComplementsGroupsRef = (businessId: string, productId: string) =>
    this.getBusinessProductRef(businessId, productId).collection('complementsgroups');
  getBusinessProductComplementGroupRef = (businessId: string, productId: string, groupId: string) =>
    this.getBusinessProductComplementsGroupsRef(businessId, productId).doc(groupId);
  getBusinessProductComplementsRef = (businessId: string, productId: string) =>
    this.getBusinessProductRef(businessId, productId).collection('complements');
  getBusinessProductComplementRef = (businessId: string, productId: string, complementId: string) =>
    this.getBusinessProductComplementsRef(businessId, productId).doc(complementId);
  // new complements logic
  getBusinessComplementsGroupsRef = (businessId: string) =>
    this.getBusinessRef(businessId, 'complementsgroups').collection('complementsgroups');
  getBusinessComplementGroupRef = (businessId: string, groupId: string) =>
    this.getBusinessComplementsGroupsRef(businessId).doc(groupId);
  getBusinessComplementsRef = (businessId: string) =>
    this.getBusinessRef(businessId, 'complements').collection('complements');
  getBusinessComplementRef = (businessId: string, complementId: string) =>
    this.getBusinessComplementsRef(businessId).doc(complementId);

  // business private subcollections and docs
  getBusinessPrivateRef = (id: string) => this.getBusinessRef(id, 'private').collection('private');
  getBusinessBankAccountRef = (id: string) => this.getBusinessPrivateRef(id).doc('bank');
  getBusinessMarketPlaceRef = (id: string) => this.getBusinessPrivateRef(id).doc('marketplace');

  // managers
  getManagersRef = () => {
    return this.firestore.collection('managers');
  };
  getManagerRef = (managerId: string) => this.firestore.collection('managers').doc(managerId);

  // orders
  getOrdersRef = (stopMonitoring?: boolean) => {
    return this.firestore.collection('orders');
  };
  getOrderRef = (id: string, collection?: string) => {
    return this.getOrdersRef(true).doc(id);
  };
  getOrderChatRef = (id: string) => this.getOrderRef(id, 'chat').collection('chat');
  getOrderIssuesRef = (id: string) => this.getOrderRef(id, 'issues').collection('issues');
  getOrderLogsRef = (id: string) => this.getOrderRef(id, 'logs').collection('logs');
  getOrderPrivateRef = (id: string, doc?: string) =>
    this.getOrderRef(id, `private:${doc ?? ''}`).collection('private');
  getOrderPaymentsRef = (id: string) => this.getOrderPrivateRef(id, 'payments').doc('payments');
  getOrderCancellationRef = (id: string) =>
    this.getOrderPrivateRef(id, 'cancellation').doc('cancellation');
  getOrderConfirmationRef = (id: string) =>
    this.getOrderPrivateRef(id, 'confirmation').doc('confirmation');
  getOrderMatchingRef = (id: string) => this.getOrderPrivateRef(id, 'matching').doc('matching');
  getOrderFraudPreventionRef = (id: string) =>
    this.getOrderPrivateRef(id, 'fraudprevention').doc('fraudprevention');

  // chats
  getChatsRef = () => this.firestore.collection('chats');
  getChatMessageRef = (messageId: string) => this.getChatsRef().doc(messageId);

  // invoices
  getInvoicesRef = () => {
    return this.firestore.collection('invoices');
  };

  // consumers
  getConsumersRef = () => {
    return this.firestore.collection('consumers');
  };
  getConsumerRef = (id: string) => this.getConsumersRef().doc(id);
  getConsumerProfileNotesRef = (id: string) => this.getConsumerRef(id).collection('profilenotes');
  getConsumerProfileNoteRef = (id: string, profileNoteId: string) =>
    this.getConsumerProfileNotesRef(id).doc(profileNoteId);

  // couriers
  getCouriersRef = () => {
    return this.firestore.collection('couriers');
  };
  getCourierRef = (id: string) => this.getCouriersRef().doc(id);
  getCourierReviewsRef = (id: string) => this.getCourierRef(id).collection('reviews');
  getCourierPrivateRef = (id: string) => this.getCourierRef(id).collection('private');
  getCourierMarketPlaceRef = (id: string) => this.getCourierPrivateRef(id).doc('marketplace');
  getCourierProfileNotesRef = (id: string) => this.getCourierRef(id).collection('profilenotes');
  getCourierProfileNoteRef = (id: string, profileNoteId: string) =>
    this.getCourierProfileNotesRef(id).doc(profileNoteId);

  // fleets
  getFleetsRef = () => {
    return this.firestore.collection('fleets');
  };
  getFleetRef = (id: string) => this.getFleetsRef().doc(id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // invoices
  getRecommendationsRef = () => {
    return this.firestore.collection('recommendations');
  };
  getRecommendationRef = (id: string) => this.getRecommendationsRef().doc(id);

  // storage
  // business
  getBusinessStoragePath = (businessId: string) => `businesses/${businessId}`;
  getBusinessLogoUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo_240x240.jpg`;
  getBusinessLogoStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo_240x240.jpg`;
  getBusinessCoverUploadStoragePath = (businessId: string, size: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover_${size}.jpg`;
  getBusinessCoverStoragePath = (businessId: string, size: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover_${size}.jpg`;
  getProductsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/products`;
  getProductUploadStoragePath = (businessId: string, productId: string, size: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}_${size}.jpg`;
  getProductImageStoragePath = (businessId: string, productId: string, size: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}_${size}.jpg`;
  getComplementsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/complements`;
  getComplementUploadStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;
  getComplementImageStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;
  // courier
  getCourierStoragePath = (courierId: string) => `couriers/${courierId}`;
  getCourierSelfieStoragePath = (courierId: string, size?: string) =>
    `${this.getCourierStoragePath(courierId)}/selfie${size ? `${size}` : ''}.jpg`;
  getCourierDocumentStoragePath = (courierId: string, size?: string) =>
    `${this.getCourierStoragePath(courierId)}/document${size ? `${size}` : ''}.jpg`;
  // consumer
  getConsumerStoragePath = (consumerId: string) => `consumers/${consumerId}`;
  getConsumerSelfieStoragePath = (consumerId: string, size?: string) =>
    `${this.getConsumerStoragePath(consumerId)}/selfie${size ? `${size}` : ''}.jpg`;
  getConsumerDocumentStoragePath = (consumerId: string, size?: string) =>
    `${this.getConsumerStoragePath(consumerId)}/document${size ? `${size}` : ''}.jpg`;
}
