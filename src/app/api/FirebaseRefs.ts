import firebase from 'firebase/app';

export default class FirebaseRefs {
  constructor(
    private functions: firebase.functions.Functions,
    private firestore: firebase.firestore.Firestore
  ) {}

  // functions
  getDeleteAccountCallable = () => this.functions.httpsCallable('deleteAccount');

  // firestore
  // platform
  getPlatformRef = () => this.firestore.collection('platform');

  // platform docs
  getPlatformParamsRef = () => this.getPlatformRef().doc('params');
  getPlatformStatisticsRef = () => this.getPlatformRef().doc('statistics');
  getPlatformDatasRef = () => this.getPlatformRef().doc('data');

  // platform data subcollections
  getBanksRef = () => this.getPlatformDatasRef().collection('banks');
  getIssuesRef = () => this.getPlatformDatasRef().collection('issues');
  getCuisinesRef = () => this.getPlatformDatasRef().collection('cuisines');

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
  getBusinessMenuConfigRef = (businessId: string, menuId: string = 'default') =>
    this.getBusinessRef(businessId).collection('menu').doc(menuId);

  // business private subcollections and docs
  getBusinessPrivateRef = (id: string) => this.getBusinessesRef().doc(id).collection('private');
  getBusinessBankAccountRef = (id: string) => this.getBusinessPrivateRef(id).doc('bank');
  getBusinessStatisticsRef = (id: string) => this.getBusinessPrivateRef(id).doc('statistics');

  // managers
  getManagersRef = () => this.firestore.collection('managers');
  getManagerRef = (managerId: string) => this.firestore.collection('managers').doc(managerId);

  // orders
  getOrdersRef = () => this.firestore.collection('orders');
  getOrderRef = (id: string) => this.getOrdersRef().doc(id);
  getOrderChatRef = (id: string) => this.getOrdersRef().doc(id).collection('chat');

  // consumers
  getConsumersRef = () => this.firestore.collection('consumers');
  getConsumerRef = (id: string) => this.getConsumersRef().doc(id);

  // couriers
  getCouriersRef = () => this.firestore.collection('couriers');
  getCourierRef = (id: string) => this.getCouriersRef().doc(id);

  // fleets
  getFleetsRef = () => this.firestore.collection('fleets');
  getFleetRef = (id: string) => this.getFleetsRef().doc(id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // storage
  getBusinessStoragePath = (businessId: string) => `businesses/${businessId}`;
  getBusinessLogoUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo.jpg`;
  getBusinessLogoStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo_1024x1024.jpg`;
  getBusinessCoverUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover.jpg`;
  getBusinessCoverStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover_1024x1024.jpg`;
  getProductsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/products`;
  getProductUploadStoragePath = (businessId: string, productId: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}.jpg`;
  getProductImageStoragePath = (businessId: string, productId: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}_1024x1024.jpg`;
  getComplementsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/complements`;
  getComplementUploadStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}.jpg`;
  getComplementImageStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_1024x1024.jpg`;
}
