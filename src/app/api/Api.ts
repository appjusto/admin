import { ApiConfig } from 'app/api/config/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import AuthApi from './auth/AuthApi';
import FilesApi from './FilesApi';
import BusinessApi from './business/BusinessApi';
import ManagerProfile from './manager/ManagerApi';

export default class Api {
  private static _firebaseInitialized: boolean = false;

  private _authentication: firebase.auth.Auth;
  private _firestore: firebase.firestore.Firestore;
  private _functions: firebase.functions.Functions;
  private _storage: firebase.storage.Storage;

  private _auth: AuthApi;
  private _files: FilesApi;
  private _manager: ManagerProfile;
  private _business: BusinessApi;

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

    this._auth = new AuthApi(this._authentication, this._functions, config);
    this._files = new FilesApi(this._storage);
    this._manager = new ManagerProfile(this._firestore, this._functions);
    this._business = new BusinessApi(this._firestore, this._functions, this._files);
  }

  auth() {
    return this._auth;
  }

  manager() {
    return this._manager;
  }

  business() {
    return this._business;
  }
}
