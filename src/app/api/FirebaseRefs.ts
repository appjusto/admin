import firebase from 'firebase/app';

export default class FirebaseRefs {
  constructor(
    private functions: firebase.functions.Functions,
    private firestore: firebase.firestore.Firestore
  ) {}

  // functions
  getBatchRef = () => this.firestore.batch();
  getDeleteAccountCallable = () => this.functions.httpsCallable('deleteAccount');
  getCreateBusinessProfileCallable = () => this.functions.httpsCallable('createBusinessProfile');
  getCreateManagerCallable = () => this.functions.httpsCallable('createManager');
  getGetBusinessManagersCallable = () => this.functions.httpsCallable('getBusinessManagers');
  getCancelOrderCallable = () => this.functions.httpsCallable('cancelOrder');
  getMatchOrderCallable = () => this.functions.httpsCallable('matchOrder');

  // firestore
  // platform
  getPlatformRef = () => this.firestore.collection('platform');

  // platform docs
  getPlatformParamsRef = () => this.getPlatformRef().doc('params');
  getPlatformStatisticsRef = () => this.getPlatformRef().doc('statistics');
  getPlatformDatasRef = () => this.getPlatformRef().doc('data');
  getPlatformLogsRef = () => this.getPlatformRef().doc('logs');

  // platform data subcollections
  getBanksRef = () => this.getPlatformDatasRef().collection('banks');
  getIssuesRef = () => this.getPlatformDatasRef().collection('issues');
  getCuisinesRef = () => this.getPlatformDatasRef().collection('cuisines');

  // platform logs subcollections
  getPlatformLoginLogsRef = () => this.getPlatformLogsRef().collection('logins');

  // businesses
  getBusinessesRef = () => this.firestore.collection('businesses');
  getBusinessRef = (id: string) => this.getBusinessesRef().doc(id);

  // business menu
  getBusinessCategoriesRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('categories');
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    this.getBusinessCategoriesRef(businessId).doc(categoryId);
  getBusinessProductsRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('products');
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
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    this.getBusinessRef(businessId).collection('menu').doc(menuId);

  // business private subcollections and docs
  getBusinessPrivateRef = (id: string) => this.getBusinessesRef().doc(id).collection('private');
  getBusinessBankAccountRef = (id: string) => this.getBusinessPrivateRef(id).doc('bank');
  getBusinessMarketPlaceRef = (id: string) => this.getBusinessPrivateRef(id).doc('marketplace');

  // managers
  getManagersRef = () => this.firestore.collection('managers');
  getManagerRef = (managerId: string) => this.firestore.collection('managers').doc(managerId);

  // orders
  getOrdersRef = () => this.firestore.collection('orders');
  getOrderRef = (id: string) => this.getOrdersRef().doc(id);
  getOrderChatRef = (id: string) => this.getOrderRef(id).collection('chat');
  getOrderIssuesRef = (id: string) => this.getOrderRef(id).collection('issues');
  getOrderLogsRef = (id: string) => this.getOrderRef(id).collection('logs');
  getOrderPrivateRef = (id: string) => this.getOrderRef(id).collection('private');
  getOrderPaymentsRef = (id: string) => this.getOrderPrivateRef(id).doc('payments');
  getOrderCancellationRef = (id: string) => this.getOrderPrivateRef(id).doc('cancellation');
  getOrderConfirmationRef = (id: string) => this.getOrderPrivateRef(id).doc('confirmation');
  getOrderMatchingRef = (id: string) => this.getOrderPrivateRef(id).doc('matching');

  // invoices
  getInvoicesRef = () => this.firestore.collection('invoices');

  // consumers
  getConsumersRef = () => this.firestore.collection('consumers');
  getConsumerRef = (id: string) => this.getConsumersRef().doc(id);

  // couriers
  getCouriersRef = () => this.firestore.collection('couriers');
  getCourierRef = (id: string) => this.getCouriersRef().doc(id);
  getCourierPrivateRef = (id: string) => this.getCourierRef(id).collection('private');
  getCourierMarketPlaceRef = (id: string) => this.getCourierPrivateRef(id).doc('marketplace');

  // fleets
  getFleetsRef = () => this.firestore.collection('fleets');
  getFleetRef = (id: string) => this.getFleetsRef().doc(id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // storage
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

  getCourierStoragePath = (courierId: string) => `couriers/${courierId}`;
  getCourierProfilePictureStoragePath = (courierId: string, size: string) =>
    `${this.getCourierStoragePath(courierId)}/selfie${size}.jpg`;
  getCourierDocumentPictureStoragePath = (courierId: string, size: string) =>
    `${this.getCourierStoragePath(courierId)}/document${size}.jpg`;
}
