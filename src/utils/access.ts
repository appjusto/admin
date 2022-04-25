import { UserPermissions } from '@appjusto/types';
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

type AdminAccess = {
  'orders': string;
  'sharing': string;
  'menu': string;
  'business-schedules': string;
  'delivery-area': string;
  'orders-history': string;
  'finances': string;
  'business-profile': string;
  'banking-information': string;
  'team': string;
  'chat': string;
  'manager-profile': string;
};

// const adminAccess = {
//   'orders': 'orders',
//   'sharing': 'orders',
//   'menu': 'menu',
//   'business-schedules': 'businesses',
//   'delivery-area': 'businesses',
//   'orders-history': 'orders',
//   'finances': 'withdraws',
//   'business-profile': 'businesses',
//   'banking-information': 'businesses',
//   'team': 'managers',
//   'chat': 'orders',
// } as AdminAccess;

// const adminOwnerPages = [
//   'orders',
//   'sharing',
//   'menu',
//   'business-schedules',
//   'delivery-area',
//   'orders-history',
//   'finances',
//   'business-profile',
//   'banking-information',
//   'team',
//   'chat',
// ]

const adminManagerPages = [
  'orders',
  'sharing',
  'menu',
  'business-schedules',
  'delivery-area',
  'orders-history',
  'finances',
  'business-profile',
  'banking-information',
  'chat',
];

const adminCollaboratorPages = ['orders', 'sharing', 'menu', 'orders-history', 'chat'];

type IsAccessGrantedArgs = {
  type: 'admin' | 'backoffice';
  path: string;
  backofficePermissions?: UserPermissions;
  adminRole?: AdminRole | null;
};

export const isAccessGranted = (args: IsAccessGrantedArgs) => {
  const { type, path, backofficePermissions, adminRole } = args;
  try {
    if (type === 'admin' && backofficePermissions) return true;
    if (type === 'admin' && adminRole) {
      const page = path.split('/app/')[1] as keyof AdminAccess;
      if (!page || adminRole === 'owner' || page === 'manager-profile') return true;
      if (adminRole === 'manager') {
        return adminManagerPages.includes(page);
      } else if (adminRole === 'collaborator') {
        return adminCollaboratorPages.includes(page);
      }
    } else if (type === 'backoffice' && backofficePermissions) {
      const page = path.split('/backoffice/')[1] as keyof BackofficeAccess;
      if (!page || page === 'staff-profile') return true;
      const accessProperty = backofficeAccess[page] as keyof UserPermissions;
      return backofficePermissions[accessProperty].includes('read');
    }
    return false;
  } catch (error) {
    console.error('isAccessGranted Error:', error);
    return false;
  }
};
