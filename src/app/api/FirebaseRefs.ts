import { collection, doc, Firestore, writeBatch } from 'firebase/firestore';
import { Functions, httpsCallable } from 'firebase/functions';
export default class FirebaseRefs {
  constructor(private functions: Functions, private firestore: Firestore) {}

  // functions
  getServerTimeCallable = () => httpsCallable(this.functions, 'getServerTime');
  getQueryGoogleMapsCallable = () => httpsCallable(this.functions, 'queryGoogleMaps');
  getUpdateEmailCallable = () => httpsCallable(this.functions, 'updateEmail');
  getDeleteAccountCallable = () => httpsCallable(this.functions, 'deleteAccount');
  // getCreateBusinessProfileCallable = () => httpsCallable(this.functions, 'createBusinessProfile');
  // getUpdateBusinessSlugCallable = () => httpsCallable(this.functions, 'updateBusinessSlug');
  // getCloneBusinessCallable = () => httpsCallable(this.functions, 'cloneBusiness');
  getBusinessProfileCallable = () => httpsCallable(this.functions, 'businessProfile');
  getCloneComplementsGroupCallable = () => httpsCallable(this.functions, 'cloneComplementsGroup');
  getCreateManagersCallable = () => httpsCallable(this.functions, 'createManagers');
  getGetManagersCallable = () => httpsCallable(this.functions, 'getManagers');
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
  getUserRef = (userId: string) => doc(this.getUsersRef(), userId);
  getUsersChangesRef = () => collection(this.getUsersRef(), 'subcollections', 'changes');
  getUsersChangeRef = (changeId: string) => doc(this.getUsersChangesRef(), changeId);

  // advances
  getAdvancesRef = () => collection(this.firestore, 'advances');

  // withdraws
  getWithdrawsRef = () => collection(this.firestore, 'withdraws');

  // platform
  getPlatformRef = () => collection(this.firestore, 'platform');
  // platform docs
  getPlatformParamsRef = () => doc(this.getPlatformRef(), 'params');
  getPlatformStatisticsRef = () => doc(this.getPlatformRef(), 'statistics');
  getPlatformDataRef = () => doc(this.getPlatformRef(), 'data');
  getPlatformLogsRef = () => doc(this.getPlatformRef(), 'logs');
  getPlatformAccessRef = () => doc(this.getPlatformRef(), 'access');
  // fraud prevention
  getFraudPreventionRef = () => doc(this.getPlatformRef(), 'fraud');
  getFraudPreventionSubdocsRef = () => collection(this.getFraudPreventionRef(), 'subdocs');
  getFraudPreventionParamsRef = () => doc(this.getFraudPreventionSubdocsRef(), 'params');
  getFlaggedLocationsRef = () => collection(this.getFraudPreventionRef(), 'flaggedlocations');
  getFlaggedLocationRef = (locationId: string) => doc(this.getFlaggedLocationsRef(), locationId);
  // platform data subcollections
  getBanksRef = () => collection(this.getPlatformDataRef(), 'banks');
  getIssuesRef = () => collection(this.getPlatformDataRef(), 'issues');
  getCuisinesRef = () => collection(this.getPlatformDataRef(), 'cuisines');
  getClassificationsRef = () => collection(this.getPlatformDataRef(), 'classifications');
  // platform logs subcollections
  getPlatformLogsLoginsRef = () => collection(this.getPlatformLogsRef(), 'logins');

  // businesses
  getBusinessesRef = () => collection(this.firestore, 'businesses');
  getBusinessRef = (businessId: string) => doc(this.getBusinessesRef(), businessId);
  getBusinessProfileNotesRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'profilenotes');
  getBusinessProfileNoteRef = (businessId: string, profileNoteId: string) =>
    doc(this.getBusinessProfileNotesRef(businessId), profileNoteId);
  // business menu
  getBusinessMenuRef = (businessId: string) => collection(this.getBusinessRef(businessId), 'menu');
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    doc(this.getBusinessMenuRef(businessId), menuId);
  getBusinessMenuMessageRef = (businessId: string) =>
    doc(this.getBusinessMenuRef(businessId), 'message');
  getBusinessCategoriesRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'categories');
  getBusinessCategoryNewRef = (businessId: string) =>
    doc(this.getBusinessCategoriesRef(businessId)).id;
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    doc(this.getBusinessCategoriesRef(businessId), categoryId);
  getBusinessProductsRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'products');
  getBusinessProductNewRef = (businessId: string) =>
    doc(this.getBusinessProductsRef(businessId)).id;
  getBusinessProductRef = (businessId: string, productId: string) =>
    doc(this.getBusinessProductsRef(businessId), productId);
  // new complements logic
  getBusinessComplementsGroupsRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'complementsgroups');
  getBusinessComplementsGroupRef = (businessId: string, groupId: string) =>
    doc(this.getBusinessComplementsGroupsRef(businessId), groupId);
  getBusinessComplementsRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'complements');
  getBusinessComplementNewRef = (businessId: string) =>
    doc(this.getBusinessComplementsRef(businessId)).id;
  getBusinessComplementRef = (businessId: string, complementId: string) =>
    doc(this.getBusinessComplementsRef(businessId), complementId);
  // business private subcollections and docs
  getBusinessPrivateRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'private');
  getBusinessBankAccountRef = (businessId: string) =>
    doc(this.getBusinessPrivateRef(businessId), 'bank');
  getBusinessMarketPlaceRef = (businessId: string) =>
    doc(this.getBusinessPrivateRef(businessId), 'marketplace');

  // staff
  getStaffsRef = () => collection(this.firestore, 'staff');
  getStaffRef = (staffId: string) => doc(this.getStaffsRef(), staffId);
  getStaffPrivateRef = (staffId: string) => collection(this.getStaffRef(staffId), 'private');
  getStaffDeletionRef = (staffId: string) => doc(this.getStaffPrivateRef(staffId), 'deletion');

  // managers
  getManagersRef = () => collection(this.firestore, 'managers');
  getManagerRef = (managerId: string) => doc(this.getManagersRef(), managerId);

  // orders
  getOrdersRef = () => collection(this.firestore, 'orders');
  getOrderRef = (orderId: string) => doc(this.getOrdersRef(), orderId);
  getOrderIssuesRef = (orderId: string) => collection(this.getOrderRef(orderId), 'issues');
  getOrderLogsRef = (orderId: string) => collection(this.getOrderRef(orderId), 'logs');
  getOrderNotesRef = (orderId: string) => collection(this.getOrderRef(orderId), 'ordernotes');
  getOrderNoteRef = (orderId: string, orderNoteId: string) =>
    doc(this.getOrderNotesRef(orderId), orderNoteId);
  // orders private
  getOrderPrivateRef = (orderId: string) => collection(this.getOrderRef(orderId), 'private');
  getOrderPaymentsRef = (orderId: string) => doc(this.getOrderPrivateRef(orderId), 'payments');
  getOrderCancellationRef = (orderId: string) =>
    doc(this.getOrderPrivateRef(orderId), 'cancellation');
  getOrderConfirmationRef = (orderId: string) =>
    doc(this.getOrderPrivateRef(orderId), 'confirmation');
  getOrderMatchingRef = (orderId: string) => doc(this.getOrderPrivateRef(orderId), 'matching');
  getOrderFraudPreventionRef = (orderId: string) =>
    doc(this.getOrderPrivateRef(orderId), 'fraudprevention');

  // chats
  getChatsRef = () => collection(this.firestore, 'chats');
  getChatMessageRef = (messageId: string) => doc(this.getChatsRef(), messageId);

  // invoices
  getInvoicesRef = () => collection(this.firestore, 'invoices');
  getInvoiceRef = (invoiceId: string) => doc(this.getInvoicesRef(), invoiceId);

  // consumers
  getConsumersRef = () => collection(this.firestore, 'consumers');
  getConsumerRef = (consumerId: string) => doc(this.getConsumersRef(), consumerId);
  getConsumerProfileNotesRef = (consumerId: string) =>
    collection(this.getConsumerRef(consumerId), 'profilenotes');
  getConsumerProfileNoteRef = (consumerId: string, profileNoteId: string) =>
    doc(this.getConsumerProfileNotesRef(consumerId), profileNoteId);

  // couriers
  getCouriersRef = () => collection(this.firestore, 'couriers');
  getCourierRef = (courierId: string) => doc(this.getCouriersRef(), courierId);
  getCourierPrivateRef = (courierId: string) =>
    collection(this.getCourierRef(courierId), 'private');
  getCourierMarketPlaceRef = (courierId: string) =>
    doc(this.getCourierPrivateRef(courierId), 'marketplace');
  getCourierProfileNotesRef = (courierId: string) =>
    collection(this.getCourierRef(courierId), 'profilenotes');
  getCourierProfileNoteRef = (courierId: string, profileNoteId: string) =>
    doc(this.getCourierProfileNotesRef(courierId), profileNoteId);

  // reviews
  getReviewsRef = () => collection(this.firestore, 'reviews');

  // fleets
  getFleetsRef = () => collection(this.firestore, 'fleets');
  getFleetRef = (fleetId: string) => doc(this.getFleetsRef(), fleetId);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // invoices
  getRecommendationsRef = () => collection(this.firestore, 'recommendations');
  getRecommendationRef = (recommendationsId: string) =>
    doc(this.getRecommendationsRef(), recommendationsId);

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
