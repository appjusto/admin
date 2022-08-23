import { Invoice, WithId } from '@appjusto/types';

export const getAccountBtnLabel = (invoice?: WithId<Invoice> | null) => {
  if (!invoice || invoice.accountType === 'platform') return null;
  if (invoice.accountType === 'business') return 'Ver restaurante';
  else return 'Ver entregador';
};

export const getAccountBtnLink = (invoice?: WithId<Invoice> | null) => {
  if (!invoice || invoice.accountType === 'platform') return '';
  let type = 'couriers';
  if (invoice.accountType === 'business') type = 'businesses';
  return `/backoffice/${type}/${invoice?.accountId}`;
};
