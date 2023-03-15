import { FirebaseError } from 'app/api/types';

const skippedExceptionsCode = [
  'ignored-error',
  'auth/user-not-found',
  'auth/wrong-password',
  'auth/invalid-action-code',
  'auth/too-many-requests',
  'auth/requires-recent-login',
  'auth/network-request-failed',
  'permission-denied',
  'functions/already-exists',
];

const skippedExceptionsMessage = [
  'Não foi possível terceirizar a entrega. Tente novamente.',
];

const skippedExceptionsFnName = ['importMenu'];

export const shouldCapture = (fnName: string, error: FirebaseError) => {
  const { code, message } = error;
  if (skippedExceptionsFnName.includes(fnName)) return false;
  if (code && skippedExceptionsCode.includes(code)) return false;
  if (message && skippedExceptionsMessage.includes(message)) return false;
  return true;
};
