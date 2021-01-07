import { ApiConfig } from 'app/api/config/types';
import MapsApi from 'core/api/thirdparty/maps/MapsApi';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import AuthApi from './auth/AuthApi';
import BusinessApi from './business/BusinessApi';
import FilesApi from './FilesApi';
import FirestoreRefs from './FirebaseRefs';
import ManagerApi from './manager/ManagerApi';
import OrderApi from './order/OrderApi';
import PlatformApi from './platform/PlatformApi';

export default class Api {
  private static _firebaseInitialized: boolean = false;

  private _authentication: firebase.auth.Auth;
  private _firestore: firebase.firestore.Firestore;
  private _functions: firebase.functions.Functions;
  private _storage: firebase.storage.Storage;

  private _refs: FirestoreRefs;
  private _auth: AuthApi;
  private _files: FilesApi;
  private _maps: MapsApi;
  private _platform: PlatformApi;
  private _manager: ManagerApi;
  private _business: BusinessApi;
  private _order: OrderApi;

  constructor(config: ApiConfig) {
    if (!Api._firebaseInitialized) {
      firebase.initializeApp({ ...config.firebase.config });
      Api._firebaseInitialized = true;
    }

    this._authentication = firebase.auth();
    this._firestore = firebase.firestore();
    this._functions = firebase.functions();
    this._storage = firebase.storage();

    if (
      config.firebase.options.useEmulator &&
      config.firebase.options.emulatorHost &&
      config.firebase.options.emulatorPort
    ) {
      const { emulatorHost, emulatorPort } = config.firebase.options;
      this._firestore.useEmulator(emulatorHost, emulatorPort);
    }

    this._refs = new FirestoreRefs(this._functions, this._firestore);
    this._auth = new AuthApi(this._refs, this._authentication, config);
    this._files = new FilesApi(this._storage);
    this._maps = new MapsApi(config.googleMapsApiKey);
    this._platform = new PlatformApi(this._refs);
    this._manager = new ManagerApi(this._refs);
    this._business = new BusinessApi(this._refs, this._files);
    this._order = new OrderApi(this._refs);
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

  manager() {
    return this._manager;
  }

  business() {
    return this._business;
  }

  order() {
    return this._order;
  }
}
