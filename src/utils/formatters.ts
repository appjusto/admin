import i18n, { ToCurrencyOptions } from 'i18n-js';
import { round } from 'lodash';

// price and totals
export const formatCurrency = (value: number, options?: ToCurrencyOptions) =>
  i18n.toCurrency(value / 100, options);

// percentage
export const formatPct = (value: number) => `${parseFloat((value * 100).toFixed(2))}%`;

// date & time
export const formatDate = (date: Date, pattern: 'default' | 'monthYear' = 'default') =>
  i18n.l(`date.formats.${pattern}`, date);
export const formatTime = (date: Date) => i18n.l('time.formats.default', date);
export const getMonthName = (month: number) => i18n.strftime(new Date(2020, month, 1), '%B');

export const formatDuration = (duration: number) => {
  return `${round(duration / 60, 0)} min`;
};

// distance
export const formatDistance = (distance: number) => {
  if (distance < 1000) return `${distance}m`;
  return `${round(distance / 1000, 2)}km`;
};
