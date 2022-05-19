import { ApiConfig } from 'app/api/config/types';
import MapsApi from 'core/api/thirdparty/maps/MapsApi';
import { Analytics, getAnalytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  FirestoreSettings,
  initializeFirestore,
} from 'firebase/firestore';
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, FirebaseStorage, getStorage } from 'firebase/storage';
import AuthApi from './auth/AuthApi';
import BusinessApi from './business/BusinessApi';
import ChatApi from './chat/ChatApi';
import ConsumerApi from './consumer/CosumerApi';
import CourierApi from './courier/CourierApi';
import FilesApi from './FilesApi';
import FirebaseRefs from './FirebaseRefs';
import ManagerApi from './manager/ManagerApi';
import MeasurementApi from './measurement/MeasurementApi';
import OrderApi from './order/OrderApi';
import PlatformApi from './platform/PlatformApi';
import StaffApi from './staff/StaffApi';
import UsersApi from './users/UsersApi';

export default class Api {
  private static app: FirebaseApp;

  private _authentication: Auth;
  private _firestore: Firestore;
  private _functions: Functions;
  private _storage: FirebaseStorage;
  private _analytics: Analytics;

  private _refs: FirebaseRefs;
  private _auth: AuthApi;
  private _files: FilesApi;
  private _maps: MapsApi;
  private _platform: PlatformApi;
  private _staff: StaffApi;
  private _manager: ManagerApi;
  private _business: BusinessApi;
  private _order: OrderApi;
  private _courier: CourierApi;
  private _consumer: ConsumerApi;
  private _users: UsersApi;
  private _measurement: MeasurementApi;
  private _chat: ChatApi;

  constructor(config: ApiConfig) {
    if (!Api.app) {
      Api.app = initializeApp({ ...config.firebase.config });
    }
    this._authentication = getAuth(Api.app);
    let firestoreSettings = {} as FirestoreSettings;
    // @ts-ignore
    if (window.Cypress) {
      firestoreSettings = {
        experimentalForceLongPolling: true,
        host: 'localhost:8080',
        ssl: false,
      };
    }
    this._firestore = initializeFirestore(Api.app, firestoreSettings);

    this._functions = getFunctions(Api.app, config.firebase.config.region);
    this._storage = getStorage(Api.app);
    this._analytics = getAnalytics(Api.app);
    setAnalyticsCollectionEnabled(this._analytics, false);

    if (config.firebase.options.useEmulator && config.firebase.options.emulatorHost) {
      const { emulatorHost } = config.firebase.options;
      connectAuthEmulator(this._authentication, `http://${emulatorHost}:9099`);
      connectFirestoreEmulator(this._firestore, emulatorHost, 8080);
      connectFunctionsEmulator(this._functions, emulatorHost, 5001);
      // this._storage = Api.app.storage('gs://default-bucket');
      // this._storage.useEmulator(emulatorHost, 9199);
      connectStorageEmulator(this._storage, emulatorHost, 9199);
    }

    this._refs = new FirebaseRefs(this._functions, this._firestore);
    this._auth = new AuthApi(this._refs, this._authentication, config);
    this._files = new FilesApi(this._storage);
    this._maps = new MapsApi(this._refs, config.googleMapsApiKey);
    this._platform = new PlatformApi(this._refs);
    this._staff = new StaffApi(this._refs);
    this._manager = new ManagerApi(this._refs);
    this._business = new BusinessApi(this._refs, this._files);
    this._order = new OrderApi(this._refs, this._files);
    this._courier = new CourierApi(this._refs, this._files);
    this._consumer = new ConsumerApi(this._refs, this._files);
    this._users = new UsersApi(this._refs);
    this._measurement = new MeasurementApi(this._analytics);
    this._chat = new ChatApi(this._refs);
  }

  measurement() {
    return this._measurement;
  }

  auth() {
    return this._auth;
  }

  maps() {
    return this._maps;
  }

  platform() {
    return this._platform;
  }

  staff() {
    return this._staff;
  }

  manager() {
    return this._manager;
  }

  business() {
    return this._business;
  }

  order() {
    return this._order;
  }

  courier() {
    return this._courier;
  }

  consumer() {
    return this._consumer;
  }

  users() {
    return this._users;
  }

  chat() {
    return this._chat;
  }
}
