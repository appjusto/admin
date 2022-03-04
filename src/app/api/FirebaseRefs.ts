import { collection, doc, Firestore } from 'firebase/firestore';
import { Functions } from 'firebase/functions';
import * as geofirestore from 'geofirestore';

export default class FirebaseRefs {
  private firestoreWithGeo: geofirestore.GeoFirestore;
  constructor(private functions: Functions, private firestore: Firestore) {
    this.firestoreWithGeo = geofirestore.initializeApp(this.firestore);
  }

  // functions
  getServerTimeCallable = () => this.functions.httpsCallable('getServerTime');
  getQueryGoogleMapsCallable = () => this.functions.httpsCallable('queryGoogleMaps');
  getUpdateEmailCallable = () => this.functions.httpsCallable('updateEmail');
  getDeleteAccountCallable = () => this.functions.httpsCallable('deleteAccount');
  getCreateBusinessProfileCallable = () => this.functions.httpsCallable('createBusinessProfile');
  getUpdateBusinessSlugCallable = () => this.functions.httpsCallable('updateBusinessSlug');
  getCloneBusinessCallable = () => this.functions.httpsCallable('cloneBusiness');
  getCloneComplementsGroupCallable = () => this.functions.httpsCallable('cloneComplementsGroup');
  getCreateManagersCallable = () => this.functions.httpsCallable('createManagers');
  getGetBusinessManagersCallable = () => this.functions.httpsCallable('getBusinessManagers');
  getCancelOrderCallable = () => this.functions.httpsCallable('cancelOrder');
  getMatchOrderCallable = () => this.functions.httpsCallable('matchOrder');
  getDropOrderCallable = () => this.functions.httpsCallable('dropOrder');
  getOutsourceDeliveryCallable = () => this.functions.httpsCallable('outsourceDelivery');
  getReleaseCourierCallable = () => this.functions.httpsCallable('releaseCourier');
  getFetchAccountInformationCallable = () =>
    this.functions.httpsCallable('fetchAccountInformation');
  getFetchReceivablesCallable = () => this.functions.httpsCallable('fetchReceivables');
  getFetchAdvanceSimulationCallable = () => this.functions.httpsCallable('fetchAdvanceSimulation');
  getRequestWithdrawCallable = () => this.functions.httpsCallable('requestWithdraw');
  getAdvanceReceivablesCallable = () => this.functions.httpsCallable('advanceReceivables');

  // firestore
  getBatchRef = () => this.firestore.batch();
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
  getFlaggedLocationsRef = () => this.getFraudPreventionRef().collection('flaggedlocations');
  getFlaggedLocationRef = (locationId: string) =>
    this.getFraudPreventionRef().collection('flaggedlocations').doc(locationId);
  // platform / fraud / flaggedlocations with geo
  getFlaggedLocationsWithGeoRef = () => {
    return this.firestoreWithGeo.collection('platform').doc('fraud').collection('flaggedlocations');
  };

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
