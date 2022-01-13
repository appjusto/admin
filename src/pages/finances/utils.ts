import { formatCurrency } from 'utils/formatters';

export const formatCents = (value: string) => parseInt(value.replace(/\D+/g, ''));

export const formatIuguValueToDisplay = (value: string) => {
  if (value.includes('R$')) return value;
  else return formatCurrency(formatCents(value));
};

export const formatIuguDateToDisplay = (date: string) => {
  const dateArr = date.split('-');
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
};
