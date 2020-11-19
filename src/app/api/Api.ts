import { ApiConfig } from 'app/config/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import AuthApi from './AuthApi';
import MenuApi from './menu/MenuApi';
import ProfileApi from './ProfileApi';

export default class Api {
  private static _firebaseInitialized: boolean = false;

  private _authentication: firebase.auth.Auth;
  private _firestore: firebase.firestore.Firestore;
  private _functions: firebase.functions.Functions;
  private _storage: firebase.storage.Storage;

  private _auth: AuthApi;
  private _profile: ProfileApi;
  private _menu: MenuApi;

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
    this._profile = new ProfileApi(this._firestore, this._functions);
    this._menu = new MenuApi(this._firestore, this._functions);
  }

  auth() {
    return this._auth;
  }

  profile() {
    return this._profile;
  }

  menu() {
    return this._menu;
  }
}
