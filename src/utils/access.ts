import { BackofficePermissions } from '@appjusto/types';
import { AdminRole } from 'app/state/auth/context';

type BackofficeAccess = {
  'orders': string;
  'couriers': string;
  'businesses': string;
  'consumers': string;
  'invoices': string;
  'users': string;
  'recommendations': string;
  'fraud-prevention': string;
  'staff': string;
  'staff-profile': string;
};

const backofficeAccess = {
  'orders': 'orders',
  'couriers': 'couriers',
  'businesses': 'businesses',
  'consumers': 'consumers',
  'invoices': 'invoices',
  'users': 'users',
  'recommendations': 'recommendations',
  'fraud-prevention': 'platform',
  'staff': 'staff',
} as BackofficeAccess;

const collaboratorPages = [
  'orders',
  'sharing',
  'menu',
  'orders-history',
  'manager-profile',
  'chat',
];

export const isAccessGranted = (
  type: 'admin' | 'backoffice',
  path: string,
  backofficePermissions?: BackofficePermissions,
  role?: AdminRole | null
) => {
  try {
    if (type === 'admin' && backofficePermissions) return true;
    else if (type === 'admin' && role) {
      const page = path.split('/app/')[1];
      if (role === 'manager' || !page) return true;
      else if (collaboratorPages.includes(page)) return true;
      else return false;
    } else if (type === 'backoffice' && backofficePermissions) {
      const page = path.split('/backoffice/')[1] as keyof BackofficeAccess;
      if (!page || page === 'staff-profile') return true;
      const accessProperty = backofficeAccess[page] as keyof BackofficePermissions;
      return backofficePermissions[accessProperty].includes('read');
    }
    return false;
  } catch (error) {
    console.error('isAccessGranted Error:', error);
    return false;
  }
};
