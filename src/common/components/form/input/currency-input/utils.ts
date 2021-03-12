//import i18n from 'i18n-js';
//const i18nValue = i18n.toCurrency(1000);
//export const unit = i18nValue.split(' ')[0];
//export const delimiter = i18nValue.split('')[4];
//export const separator = i18nValue.split('')[8];

export const unit = 'R$';
export const delimiter = '.';
export const separator = ',';

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
