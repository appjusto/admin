import '@testing-library/cypress/add-commands';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const config = Cypress.env('firebase');

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Auth
const auth = firebase.auth();
auth.useEmulator('http://localhost:9099');

attachCustomCommands({ Cypress, cy, firebase });

// handlers
const createTestingUser = async (email, password) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.log('createUserError', error);
  }
  return { email, password };
};

Cypress.Commands.add('createTestUsers', () => {
  const mainUserEmail = Cypress.env('main_user_email');
  const mainUserPassword = Cypress.env('main_user_password');
  const onboardingUserEmail = Cypress.env('onboarding_user_email');
  const onboardingUserPassword = Cypress.env('onboarding_user_password');
  createTestingUser(mainUserEmail, mainUserPassword);
  createTestingUser(onboardingUserEmail, onboardingUserPassword);
});

Cypress.Commands.add('userLogin', (email, password) => {
  const defaultEmail = Cypress.env('main_user_email');
  const defaultPassword = Cypress.env('main_user_password');
  const currentEmail = email ?? defaultEmail;
  cy.log('currentEmail', currentEmail);
  // visit
  cy.visit('/login');
  // filling login form
  cy.findByRole('textbox', { name: /e\-mail/i }).type(currentEmail);
  cy.findByRole('checkbox', { name: /login-password-checkbox/i }).check({ force: true });
  cy.findByLabelText(/senha/i).type(password ?? defaultPassword);
  cy.findByRole('button', { name: /entrar/i }).click();
});
