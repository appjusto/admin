import { ApiConfig } from 'app/config/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

export default class Api {
  static firebaseInitialized: boolean = false;

  private authentication: firebase.auth.Auth;
  private firestore: firebase.firestore.Firestore;
  private functions: firebase.functions.Functions;
  private storage: firebase.storage.Storage;

  constructor(config: ApiConfig) {
    console.log(config);
    if (!Api.firebaseInitialized) {
      firebase.initializeApp({ ...config.firebase.config });
      Api.firebaseInitialized = true;
    }

    this.authentication = firebase.auth();
    this.firestore = firebase.firestore();
    this.functions = firebase.functions();
    this.storage = firebase.storage();

    if (
      config.firebase.options.useEmulator &&
      config.firebase.options.emulatorHost &&
      config.firebase.options.emulatorPort
    ) {
      const { emulatorHost, emulatorPort } = config.firebase.options;
      this.firestore.useEmulator(emulatorHost, emulatorPort);
    }
  }
}
