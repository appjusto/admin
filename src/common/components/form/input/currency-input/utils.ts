import i18n from 'i18n-js';

const i18nValue = i18n.toCurrency(1000);
const unit = i18nValue.split(' ')[0];
const delimiter = i18nValue.split('')[4];
const separator = i18nValue.split('')[8];

const removeOccurrences = (value: string, toRemove: string) => {
  const NewToRemove = toRemove.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  const re = new RegExp(NewToRemove, 'g');
  return value.replace(re, '');
};

export const getRawValue = (value: string) => {
  if (value === '') return '0';
  let result = value;
  result = removeOccurrences(result, delimiter);
  result = removeOccurrences(result, separator);
  result = removeOccurrences(result, unit);
  return result;
};

export const formatFloatToRawValue = (float: number) => {
  let result = float.toString();
  let precision = undefined;
  if (result.length <= 2) {
    result = `${result}00`;
  } else {
    precision = result.split('.')[1]?.length;
    if (precision < 2) {
      result = `${result}0`;
    }
  }
  return result.replace('.', '');
};

export function formatToFloat(rawValue: string) {
  let newString = rawValue;
  if (newString.length < 2) {
    newString = `0${newString}`;
  }
  const len = newString.length;
  const dis = len - 2;
  const arr = newString.split('');
  arr.splice(dis, 0, '.');
  const result = parseFloat(arr.join(''));
  return result;
}

const repeatZeroes = (times: number) => {
  let result = '';
  let i = 0;
  for (i = 0; i < times; i++) {
    result += '0';
  }
  return result;
};

export const formattedRawValue = (rawValue: string) => {
  let precision = 2;
  const minChars = '0'.length + precision;
  let result = rawValue;
  if (result.length < minChars) {
    const leftZeroesToAdd = minChars - result.length;
    result = `${repeatZeroes(leftZeroesToAdd)}${result}`;
  }
  let beforeSeparator = result.slice(0, result.length - precision);
  let afterSeparator = result.slice(result.length - precision);
  if (beforeSeparator.length > 3) {
    var chars = beforeSeparator.split('').reverse();
    let withDots = '';
    for (var i = chars.length - 1; i >= 0; i--) {
      let char = chars[i];
      let dot = i % 3 === 0 ? delimiter : '';
      withDots = `${withDots}${char}${dot}`;
    }
    withDots = withDots.substring(0, withDots.length - 1);
    beforeSeparator = withDots;
  }
  result = beforeSeparator + separator + afterSeparator;
  if (unit) {
    result = `${unit} ${result}`;
  }
  return result;
};
