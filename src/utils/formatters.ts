import { separator, unit } from 'common/components/form/input/currency-input/utils';
import i18n from 'i18n-js';
import { round } from 'lodash';

// price and totals
export const itemPriceFormatter = (price: number) => {
  console.log(price);
  console.log(unit);
  const pStr = price.toString();
  const len = pStr.length;
  const pArr = pStr.split('');
  if (len === 5) return `${unit} ${pArr[0]}${pArr[1]}${pArr[2]}${separator}${pArr[3]}${pArr[4]}`;
  if (len === 4) return `${unit} ${pArr[0]}${pArr[1]}${separator}${pArr[2]}${pArr[3]}`;
  if (len === 3) return `${unit} ${pArr[0]}${separator}${pArr[1]}${pArr[2]}`;
  if (len === 2) return `${unit} 0${separator}${pArr[0]}${pArr[1]}`;
  if (len === 1) return `${unit} 0${separator}0${pArr[0]}`;
};

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
