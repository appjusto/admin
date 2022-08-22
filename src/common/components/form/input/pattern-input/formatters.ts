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
};

export const cepMask = '00000-000';
export const cepFormatter = (value: string | undefined) => {
  if (!value) return '';
  if (value.length <= 5) return value;
  return [value.slice(0, 5), value.slice(5)].join('-');
};

export const phoneMask = '(11) 99999-9999';
export const phoneFormatter = (value: string | undefined) => {
  let formatedNumber = '';
  if (value) {
    const ddd = value.slice(0, 2);
    let firstPart;
    let secondPart;
    if (value.length < 11) {
      firstPart = value.slice(2, 6);
      secondPart = value.slice(6, 10);
    } else {
      firstPart = value.slice(2, 7);
      secondPart = value.slice(7, 11);
    }
    if (secondPart === '' && firstPart !== '') {
      formatedNumber = `(${ddd}) ${firstPart}`;
    } else if (secondPart === '' && firstPart === '') {
      formatedNumber = `(${ddd}`;
    } else {
      formatedNumber = `(${ddd}) ${firstPart}-${secondPart}`;
    }
  }
  return formatedNumber;
};

export const TimeMask = '00:00';
export const timeFormatter = (value: string | undefined, isRaw?: boolean) => {
  let formatedNumber = '';
  if (value) {
    let hours = value.slice(0, 2);
    let minutes = value.slice(2, 4);
    if (parseInt(hours) > 23) {
      hours = '00';
    }
    if (parseInt(minutes) > 59) {
      minutes = '00';
    }
    if (minutes === '') {
      formatedNumber = `${hours}`;
    } else if (minutes !== '') {
      if (isRaw) formatedNumber = `${hours}${minutes}`;
      else formatedNumber = `${hours}:${minutes}`;
    }
  }
  return formatedNumber;
};

export const hyphenFormatter =
  (hyphenLocation: number) => (value: string | undefined) => {
    if (!value) return '';
    if (hyphenLocation < 0) return value;
    if (value.length <= hyphenLocation) return value;
    return [value.slice(0, hyphenLocation), value.slice(hyphenLocation)].join(
      '-'
    );
  };

export const addZerosToBeginning = (account: string, patterLen: number) => {
  const accountLen = account.length;
  if (patterLen > accountLen) {
    const diff = patterLen - accountLen;
    let zeros = '';
    for (let i = 0; i < diff; i++) {
      zeros += '0';
    }
    return `${zeros + account}`;
  } else {
    return account;
  }
};
