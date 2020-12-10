export const cpfMask = '000.000.000-00';
export const cpfFormatter = (value: string = '') => {
  return value.split('').reduce((result, digit, index) => {
    if (index === 3 || index === 6) return `${result}.${digit}`;
    if (index === 9) return `${result}-${digit}`;
    return `${result}${digit}`;
  }, '');
};

export const cnpjMask = '00.000.000/0000-00';
export const cnpjFormatter = (value: string = '') => {
  return value.split('').reduce((result, digit, index) => {
    if (index === 2 || index === 5) return `${result}.${digit}`;
    if (index === 8) return `${result}/${digit}`;
    if (index === 12) return `${result}-${digit}`;
    return `${result}${digit}`;
  }, '');
}

export const cepMask = '00000-000';
export const cepFormatter = (value: string | undefined) => {
  if (!value) return '';
  if (value.length <= 5) return value;
  return [value.slice(0, 5), value.slice(5)].join('-');
};

export const phoneMask = '99999-9999';
export const phoneFormatter = cepFormatter;