import admin from 'firebase-admin';
import { plugin as cypressFirebasePlugin } from 'cypress-firebase';

module.exports = (on, config) => {
  const extendedConfig = cypressFirebasePlugin(on, config, admin);
  return extendedConfig;
};
