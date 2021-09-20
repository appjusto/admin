export const formatCents = (value: string) => {
  let result = 0;
  if (value.includes('R$')) {
    result = parseFloat(value.split(' ')[1].replace(',', '.')) * 100;
  } else {
    result = parseFloat(value.split(' ')[0].replace(',', '.')) * 100;
  }
  return result;
};