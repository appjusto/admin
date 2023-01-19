import { AdminRole, UserPermissions } from '@appjusto/types';

type BackofficeAccess = {
  'orders': string;
  'couriers': string;
  'businesses': string;
  'consumers': string;
  'banners': string;
  'invoices': string;
  'ledger': string;
  'push-campaigns': string;
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
  'banners': 'banners',
  'invoices': 'invoices',
  'ledger': 'invoices',
  'push-campaigns': 'push_campaigns',
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
  'operation': string;
  'banking-information': string;
  'team': string;
  'chat': string;
  'manager-profile': string;
};

const adminManagerPages = [
  'orders',
  'sharing',
  'menu',
  'business-schedules',
  'delivery-area',
  'orders-history',
  'finances',
  'business-profile',
  'operation',
  'banking-information',
  'team',
  'chat',
  'insurance',
];

const adminCollaboratorPages = [
  'orders',
  'sharing',
  'menu',
  'orders-history',
  'chat',
];

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
      if (!page || adminRole === 'owner' || page === 'manager-profile')
        return true;
      if (adminRole === 'manager') {
        return adminManagerPages ? adminManagerPages.includes(page) : false;
      } else if (adminRole === 'collaborator') {
        return adminCollaboratorPages
          ? adminCollaboratorPages.includes(page)
          : false;
      }
    } else if (type === 'backoffice' && backofficePermissions) {
      const page = path.split('/backoffice/')[1] as keyof BackofficeAccess;
      if (!page || page === 'staff-profile') return true;
      const accessProperty = backofficeAccess[page] as keyof UserPermissions;
      return backofficePermissions[accessProperty]
        ? backofficePermissions[accessProperty].includes('r')
        : false;
    }
    return false;
  } catch (error) {
    console.error(`isAccessGranted Error on path: ${path}`, error);
    return false;
  }
};
