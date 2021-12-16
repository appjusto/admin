// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import getFirebaseClient from '../firebase';

// Alternatively you can use CommonJS syntax:
// require('./commands')
const config = Cypress.env('firebase');
const mainUserEmail = 'mainuser@test.com';
const mainUserPassword = 'Testing1234';
const onboardingUserEmail = 'onbuser@test.com';
const onboardingUserPassword = 'OnbTesting1234';
Cypress.env('main_user_email', mainUserEmail);
Cypress.env('main_user_password', mainUserPassword);
Cypress.env('onboarding_user_email', onboardingUserEmail);
Cypress.env('onboarding_user_password', onboardingUserPassword);

// create users
const createUsersAndClearDb = async () => {
  const { createTestingUser, deleteBusinessesByManagerEmail } = await getFirebaseClient(config);
  // main user
  await createTestingUser(mainUserEmail, mainUserPassword);
  // onboarding user
  await createTestingUser(onboardingUserEmail, onboardingUserPassword);
  // clear onboarding user businesses
  await deleteBusinessesByManagerEmail(onboardingUserEmail);
};

createUsersAndClearDb();
