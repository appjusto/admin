import { ApiConfig } from 'app/api/config/types';
import MapsApi from 'core/api/thirdparty/maps/MapsApi';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import {
  Analytics,
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  FirestoreSettings,
  initializeFirestore,
} from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from 'firebase/functions';
import {
  connectStorageEmulator,
  FirebaseStorage,
  getStorage,
} from 'firebase/storage';
import AreasApi from './areas/AreasApi';
import AuthApi from './auth/AuthApi';
import BannersApi from './banners/BannersApi';
import BusinessApi from './business/BusinessApi';
import CardsApi from './cards/CardsApi';
import ChatApi from './chat/ChatApi';
import ConsumerApi from './consumer/CosumerApi';
import CourierApi from './courier/CourierApi';
import FilesApi from './FilesApi';
import FirebaseRefs from './FirebaseRefs';
import FleetApi from './fleet/FleetApi';
import InvoicesApi from './invoices/InvoicesApi';
import LedgerApi from './ledger/LedgerApi';
import ManagerApi from './manager/ManagerApi';
import MeasurementApi from './measurement/MeasurementApi';
import OrderApi from './order/OrderApi';
import PaymentsApi from './payments/PaymentsApi';
import PlatformApi from './platform/PlatformApi';
import PushCampaignApi from './push-campaigns/PushCampaignApi';
import StaffApi from './staff/StaffApi';
import UsersApi from './users/UsersApi';
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Sao_Paulo');

export default class Api {
  private static app: FirebaseApp;
  private static secondaryApp: FirebaseApp;

  private _authentication: Auth;
  private _secondary_authentication: Auth;
  private _firestore: Firestore;
  private _functions: Functions;
  private _storage: FirebaseStorage;
  private _analytics: Analytics;

  private _refs: FirebaseRefs;
  private _auth: AuthApi;
  private _files: FilesApi;
  private _maps: MapsApi;
  private _areas: AreasApi;
  private _platform: PlatformApi;
  private _staff: StaffApi;
  private _manager: ManagerApi;
  private _business: BusinessApi;
  private _order: OrderApi;
  private _invoices: InvoicesApi;
  private _payments: PaymentsApi;
  private _cards: CardsApi;
  private _ledger: LedgerApi;
  private _courier: CourierApi;
  private _consumer: ConsumerApi;
  private _users: UsersApi;
  private _measurement: MeasurementApi;
  private _chat: ChatApi;
  private _push_campaigns: PushCampaignApi;
  private _banners: BannersApi;
  private _fleet: FleetApi;

  constructor(config: ApiConfig) {
    if (!Api.app) {
      Api.app = initializeApp({ ...config.firebase.config });
    }
    if (!Api.secondaryApp) {
      Api.secondaryApp = initializeApp(
        { ...config.firebase.config },
        'secondaryApp'
      );
    }
    this._authentication = getAuth(Api.app);
    this._secondary_authentication = getAuth(Api.secondaryApp);
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

    if (
      config.firebase.options.useEmulator &&
      config.firebase.options.emulatorHost
    ) {
      const { emulatorHost } = config.firebase.options;
      connectAuthEmulator(this._authentication, `http://${emulatorHost}:9099`);
      connectFirestoreEmulator(this._firestore, emulatorHost, 8080);
      connectFunctionsEmulator(this._functions, emulatorHost, 5001);
      connectStorageEmulator(this._storage, emulatorHost, 9199);
    }

    this._refs = new FirebaseRefs(this._functions, this._firestore);
    this._auth = new AuthApi(
      this._refs,
      this._authentication,
      this._secondary_authentication,
      config
    );
    this._files = new FilesApi(this._storage);
    this._maps = new MapsApi(this._refs, config.googleMapsApiKey);
    this._platform = new PlatformApi(this._refs);
    this._staff = new StaffApi(this._refs);
    this._manager = new ManagerApi(this._refs);
    this._business = new BusinessApi(this._refs, this._files);
    this._order = new OrderApi(this._refs, this._files);
    this._invoices = new InvoicesApi(this._refs);
    this._payments = new PaymentsApi(this._refs);
    this._cards = new CardsApi(this._refs);
    this._ledger = new LedgerApi(this._refs);
    this._courier = new CourierApi(this._refs, this._files);
    this._consumer = new ConsumerApi(this._refs, this._files);
    this._users = new UsersApi(this._refs);
    this._measurement = new MeasurementApi(this._analytics);
    this._chat = new ChatApi(this._refs);
    this._push_campaigns = new PushCampaignApi(this._refs);
    this._banners = new BannersApi(this._refs, this._files);
    this._fleet = new FleetApi(this._refs);
    this._areas = new AreasApi(this._refs);
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

  areas() {
    return this._areas;
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

  invoices() {
    return this._invoices;
  }

  payments() {
    return this._payments;
  }

  cards() {
    return this._cards;
  }

  ledger() {
    return this._ledger;
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

  push_campaigns() {
    return this._push_campaigns;
  }

  banners() {
    return this._banners;
  }

  fleet() {
    return this._fleet;
  }
}
