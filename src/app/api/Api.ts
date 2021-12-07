import { ApiConfig } from 'app/api/config/types';
import MapsApi from 'core/api/thirdparty/maps/MapsApi';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/analytics';
import AuthApi from './auth/AuthApi';
import BusinessApi from './business/BusinessApi';
import FilesApi from './FilesApi';
import FirebaseRefs from './FirebaseRefs';
import ManagerApi from './manager/ManagerApi';
import OrderApi from './order/OrderApi';
import PlatformApi from './platform/PlatformApi';
import CourierApi from './courier/CourierApi';
import ConsumerApi from './consumer/CosumerApi';
import UsersApi from './users/UsersApi';
import MeasurementApi from './measurement/MeasurementApi';

export default class Api {
  private static app: firebase.app.App;

  private _authentication: firebase.auth.Auth;
  private _firestore: firebase.firestore.Firestore;
  private _functions: firebase.functions.Functions;
  private _storage: firebase.storage.Storage;
  private _analytics: firebase.analytics.Analytics;

  private _refs: FirebaseRefs;
  private _auth: AuthApi;
  private _files: FilesApi;
  private _maps: MapsApi;
  private _platform: PlatformApi;
  private _manager: ManagerApi;
  private _business: BusinessApi;
  private _order: OrderApi;
  private _courier: CourierApi;
  private _consumer: ConsumerApi;
  private _users: UsersApi;
  private _measurement: MeasurementApi;

  constructor(config: ApiConfig) {
    if (!Api.app) {
      Api.app = firebase.initializeApp({ ...config.firebase.config });
    }

    this._authentication = Api.app.auth();
    this._firestore = Api.app.firestore();
    this._functions = Api.app.functions(config.firebase.config.region);
    this._analytics = Api.app.analytics();
    this._analytics.setAnalyticsCollectionEnabled(false);

    if (config.firebase.options.useEmulator && config.firebase.options.emulatorHost) {
      const { emulatorHost } = config.firebase.options;
      this._authentication.useEmulator(`http://${emulatorHost}:9099`);
      this._firestore.useEmulator(emulatorHost, 8080);
      this._functions.useEmulator(emulatorHost, 5001);
      this._storage = Api.app.storage('gs://default-bucket');
      this._storage.useEmulator(emulatorHost, 9199);
    } else {
      this._storage = Api.app.storage();
    }

    this._refs = new FirebaseRefs(this._functions, this._firestore);
    this._auth = new AuthApi(this._refs, this._authentication, config);
    this._files = new FilesApi(this._storage);
    this._maps = new MapsApi(config.googleMapsApiKey);
    this._platform = new PlatformApi(this._refs);
    this._manager = new ManagerApi(this._refs);
    this._business = new BusinessApi(this._refs, this._files);
    this._order = new OrderApi(this._refs);
    this._courier = new CourierApi(this._refs, this._files);
    this._consumer = new ConsumerApi(this._refs, this._files);
    this._users = new UsersApi(this._refs);
    this._measurement = new MeasurementApi(this._analytics);
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
}
