export interface FirebaseConfig {
  apiKey: string;
  region: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseOptions {
  useEmulator: boolean;
  emulatorHost?: string;
}

export interface ApiConfig {
  publicURL: string;
  firebase: {
    config: FirebaseConfig;
    options: FirebaseOptions;
  };
  googleMapsApiKey: string;
}

export interface AppConfig {
  api: ApiConfig;
}
