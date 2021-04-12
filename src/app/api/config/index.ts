import { AppConfig } from './types';

export const getConfig = (): AppConfig => {
  return {
    api: {
      publicURL: process.env.REACT_APP_PUBLIC_URL!,
      firebase: {
        config: {
          apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
          region: process.env.REACT_APP_FIREBASE_REGION!,
          authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
          databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
          functionsURL: `https://${process.env.REACT_APP_FIREBASE_REGION}-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net`,
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
          storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
          messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
          appId: process.env.REACT_APP_FIREBASE_APP_ID!,
        },
        options: {
          useEmulator: process.env.REACT_APP_FIREBASE_EMULATOR === 'true',
          emulatorHost: process.env.REACT_APP_FIREBASE_EMULATOR_HOST,
          emulatorPort: parseInt(process.env.REACT_APP_FIREBASE_EMULATOR_PORT ?? '8080'),
        },
      },
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    },
  };
};

export const getSearchConfig = () => {
  return {
    config: {
      appId: process.env.REACT_APP_ALGOLIA_APPID,
      apiKey: process.env.REACT_APP_ALGOLIA_APIKEY,
    },
    env: process.env.REACT_APP_ENVIRONMENT,
  };
};
