import { Invoice, WithId } from '@appjusto/types';
import { formatCurrency } from 'utils/formatters';

export type InvoicesCosts = { value: number; fee: number };

export const formatCents = (value: string) =>
  parseInt(value.replace(/\D+/g, ''));

export const formatIuguValueToDisplay = (value: string) => {
  try {
    if (value.includes('R$')) return value;
    else return formatCurrency(formatCents(value));
  } catch (error) {
    console.error(error);
    return 'R$ 0,00';
  }
};

export const formatIuguDateToDisplay = (date: string) => {
  const dateArr = date.split('-');
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
};

// export const calculateAppJustoCosts = (amount: number) => {
//   const fee = 0.05;
//   const value = amount * fee;
//   return { value, fee };
// };
export const calculateAppJustoCosts = (invoices: WithId<Invoice>[]) => {
  const value = invoices.reduce((total, invoice) => {
    return (total += invoice.fare?.commission ?? 0);
  }, 0);
  return value;
};

export const calculateIuguCosts = (invoices: WithId<Invoice>[]) => {
  const value = invoices.reduce((total, invoice) => {
    return (total += invoice.fare?.processing?.value ?? 0);
  }, 0);
  return value;
};
