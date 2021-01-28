import { separator, unit } from 'common/components/form/input/currency-input/utils';

export const itemPriceFormatter = (price: number) => {
  const pStr = price.toString();
  const len = pStr.length;
  const pArr = pStr.split('');
  if (len === 4) return `${unit} ${pArr[0]}${pArr[1]}${separator}${pArr[2]}${pArr[3]}`;
  if (len === 3) return `${unit} ${pArr[0]}${separator}${pArr[1]}${pArr[2]}`;
  if (len === 2) return `${unit} 0${separator}${pArr[0]}${pArr[1]}`;
  if (len === 1) return `${unit} 0${separator}0${pArr[0]}`;
};
