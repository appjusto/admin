export const getStringCents = (value: string) => {
  let result = 0;
  if (value.includes('R$')) {
    result = parseInt(value.split(' ')[1].replaceAll(',', '').replaceAll('.', ''));
  } else {
    result = parseInt(value.split(' ')[0].replaceAll(',', '').replaceAll('.', ''));
  }
  return result;
};

export const formatCents = (value: string) => {
  let result = 0;
  if (value.includes('R$')) {
    result = parseFloat(value.split(' ')[1].replace(',', '.')) * 100;
  } else {
    result = parseFloat(value.split(' ')[0].replace(',', '.')) * 100;
  }
  return result;
};

export const formatIuguValueToDisplay = (value: string) => {
  if (value.includes('R$')) return value;
  else {
    let result = value.split(' ')[0].replace('.', ',');
    return `R$ ${result}`;
  }
};

export const formatIuguDateToDisplay = (date: string) => {
  const dateArr = date.split('-');
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
};
