import { Payment, WithId } from '@appjusto/types';

export const getAccountBtnLabel = (payment?: WithId<Payment> | null) => {
  if (!payment || payment.to.accountType === 'platform') return null;
  if (payment.to.accountType === 'business') return 'Ver restaurante';
  else return 'Ver entregador';
};

export const getAccountBtnLink = (payment?: WithId<Payment> | null) => {
  if (!payment || payment.to.accountType === 'platform') return '';
  let type = 'couriers';
  if (payment.to.accountType === 'business') type = 'businesses';
  return `/backoffice/${type}/${payment?.to.accountId}`;
};
