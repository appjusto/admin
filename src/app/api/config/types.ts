export interface FirebaseConfig {
  apiKey: string;
  region: string;
  authDomain: string;
  databaseURL: string;
  functionsURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseOptions {
  useEmulator: boolean;
  emulatorHost?: string;
  emulatorPort?: number;
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
