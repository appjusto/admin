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
  getUserRef = (userId: string) => doc(this.firestore, 'users', userId);

  getUsersChangesRef = () => collection(this.firestore, 'users', 'subcollections', 'changes');
  getUsersChangeRef = (changeId: string) =>
    doc(this.firestore, 'users', 'subcollections', 'changes', changeId);

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
  getBanksRef = () => collection(this.getPlatformDatasRef(), 'banks');
  getIssuesRef = () => collection(this.getPlatformDatasRef(), 'issues');
  getCuisinesRef = () => collection(this.getPlatformDatasRef(), 'cuisines');
  getClassificationsRef = () => collection(this.getPlatformDatasRef(), 'classifications');

  // platform logs subcollections
  getPlatformLoginLogsRef = () => collection(this.getPlatformLogsRef(), 'logins');

  // businesses
  getBusinessesRef = () => collection(this.firestore, 'businesses');
  getBusinessRef = (id: string) => doc(this.firestore, 'businesses', id);
  getBusinessProfileNotesRef = (id: string) =>
    collection(this.firestore, 'businesses', id, 'profilenotes');
  getBusinessProfileNoteRef = (businessId: string, profileNoteId: string) =>
    doc(this.firestore, 'businesses', businessId, 'profilenotes', profileNoteId);

  // business menu
  getBusinessMenuRef = (businessId: string) =>
    collection(this.firestore, 'businesses', businessId, 'menu');
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    doc(this.firestore, 'businesses', businessId, 'menu', menuId);
  getBusinessMenuMessageRef = (businessId: string) =>
    doc(this.firestore, 'businesses', businessId, 'menu', 'message');
  getBusinessCategoriesRef = (businessId: string) =>
    collection(this.firestore, 'businesses', businessId, 'categories');
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    doc(this.firestore, 'businesses', businessId, 'categories', categoryId);
  getBusinessProductsRef = (businessId: string) =>
    collection(this.firestore, 'businesses', businessId, 'products');
  getBusinessProductRef = (businessId: string, productId: string) =>
    doc(this.firestore, 'businesses', businessId, 'products', productId);
  // new complements logic
  getBusinessComplementsGroupsRef = (businessId: string) =>
    collection(this.firestore, 'businesses', businessId, 'complementsgroups');
  getBusinessComplementGroupRef = (businessId: string, groupId: string) =>
    doc(this.firestore, 'businesses', businessId, 'complementsgroups', groupId);
  getBusinessComplementsRef = (businessId: string) =>
    collection(this.firestore, 'businesses', businessId, 'complements');
  getBusinessComplementRef = (businessId: string, complementId: string) =>
    doc(this.firestore, 'businesses', businessId, 'complements', complementId);

  // business private subcollections and docs
  getBusinessPrivateRef = (businessId: string) =>
    collection(this.firestore, 'businesses', businessId, 'private');
  getBusinessBankAccountRef = (businessId: string) =>
    doc(this.firestore, 'businesses', businessId, 'private', 'bank');
  getBusinessMarketPlaceRef = (businessId: string) =>
    doc(this.firestore, 'businesses', businessId, 'private', 'marketplace');

  // managers
  getManagersRef = () => collection(this.firestore, 'managers');
  getManagerRef = (managerId: string) => doc(this.firestore, 'managers', managerId);

  // orders
  getOrdersRef = () => collection(this.firestore, 'orders');
  getOrderRef = (orderId: string) => doc(this.firestore, 'orders', orderId);
  getOrderChatRef = (orderId: string) => collection(this.firestore, 'orders', orderId, 'chat');
  getOrderIssuesRef = (orderId: string) => collection(this.firestore, 'orders', orderId, 'issues');
  getOrderLogsRef = (orderId: string) => collection(this.firestore, 'orders', orderId, 'logs');
  getOrderPrivateRef = (orderId: string) =>
    collection(this.firestore, 'orders', orderId, 'private');

  getOrderPaymentsRef = (orderId: string) => doc(this.firestore, 'orders', orderId, 'payments');
  getOrderCancellationRef = (orderId: string) =>
    doc(this.firestore, 'orders', orderId, 'cancellation');
  getOrderConfirmationRef = (orderId: string) =>
    doc(this.firestore, 'orders', orderId, 'confirmation');
  getOrderMatchingRef = (orderId: string) => doc(this.firestore, 'orders', orderId, 'matching');
  getOrderFraudPreventionRef = (orderId: string) =>
    doc(this.firestore, 'orders', orderId, 'fraudprevention');

  // chats
  getChatsRef = () => collection(this.firestore, 'chats');
  getChatMessageRef = (messageId: string) => doc(this.firestore, 'chats', messageId);

  // invoices
  getInvoicesRef = () => collection(this.firestore, 'invoices');

  // consumers
  getConsumersRef = () => collection(this.firestore, 'consumers');
  getConsumerRef = (consumerId: string) => doc(this.firestore, 'consumers', consumerId);
  getConsumerProfileNotesRef = (consumerId: string) =>
    collection(this.firestore, 'consumers', consumerId, 'profilenotes');
  getConsumerProfileNoteRef = (consumerId: string, profileNoteId: string) =>
    doc(this.firestore, 'consumers', consumerId, 'profilenotes', profileNoteId);

  // couriers
  getCouriersRef = () => collection(this.firestore, 'couriers');
  getCourierRef = (courierId: string) => doc(this.firestore, 'couriers', courierId);
  getCourierReviewsRef = (courierId: string) =>
    collection(this.firestore, 'couriers', courierId, 'reviews');
  getCourierPrivateRef = (courierId: string) =>
    collection(this.firestore, 'couriers', courierId, 'private');
  getCourierMarketPlaceRef = (courierId: string) =>
    doc(this.firestore, 'couriers', courierId, 'private', 'marketplace');
  getCourierProfileNotesRef = (courierId: string) =>
    collection(this.firestore, 'couriers', courierId, 'profilenotes');
  getCourierProfileNoteRef = (courierId: string, profileNoteId: string) =>
    doc(this.firestore, 'couriers', courierId, 'profilenotes', profileNoteId);

  // fleets
  getFleetsRef = () => collection(this.firestore, 'fleets');
  getFleetRef = (fleetId: string) => doc(this.firestore, 'fleets', fleetId);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // invoices
  getRecommendationsRef = () => collection(this.firestore, 'recommendations');
  getRecommendationRef = (recommendationsId: string) =>
    doc(this.firestore, 'recommendations', recommendationsId);

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
