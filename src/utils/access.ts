import { BackofficePermissions } from '@appjusto/types';
import { GeneralRoles } from 'app/state/auth/context';

type Access = {
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

const access = {
  'orders': 'orders',
  'couriers': 'couriers',
  'businesses': 'businesses',
  'consumers': 'consumers',
  'invoices': 'orders',
  'users': 'orders',
  'recommendations': 'businesses',
  'fraud-prevention': 'platform',
  'staff': 'platform',
} as Access;

const collaboratorPages = ['orders', 'sharing', 'menu', 'orders-history', 'manager-profile'];

export const isAccessGranted = (
  type: 'admin' | 'backoffice',
  path: string,
  backofficePermissions?: BackofficePermissions,
  role?: GeneralRoles | null
) => {
  try {
    if (type === 'admin' && backofficePermissions) return true;
    else if (type === 'admin' && role) {
      const page = path.split('/app/')[1];
      if (role === 'manager' || !page) return true;
      else if (collaboratorPages.includes(page)) return true;
      else return false;
    } else if (type === 'backoffice' && backofficePermissions) {
      const page = path.split('/backoffice/')[1] as keyof Access;
      if (!page || page === 'staff-profile') return true;
      const accessProperty = access[page] as keyof BackofficePermissions;
      return backofficePermissions[accessProperty].includes('read');
    }
    return false;
  } catch (error) {
    console.error('isAccessGranted Error:', error);
    return false;
  }
};
