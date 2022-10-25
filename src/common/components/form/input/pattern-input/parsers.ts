export const numbersOnlyParser = (value: string) =>
  value.replace(/[^0-9]/g, '');

export const coordinatesOnlyParser = (value: string) =>
  value.replace(/[^0-9.-]/g, '');

export const numbersAndLettersParser = (
  mask?: string,
  padWithZeros?: boolean
) => {
  if (!mask) return undefined;
  const regexp = (char: string): RegExp => {
    if (char === '9' || char === 'D') return /\d/;
    if (char === 'X') return /\w/;
    throw new Error(`Unexpected character in mask: ${char}`);
  };
  return (value: string) => {
    let initialValue = '';
    if (padWithZeros) {
      const pad = mask.length - value.length - (mask.match(/-/g) ?? []).length;
      if (pad >= 0) initialValue = '0'.repeat(pad);
    }
    const isValueLengthIncreased = mask.length === value.length;
    const currentValue = isValueLengthIncreased
      ? value.split('').slice(1).join('')
      : value;
    return mask.split('').reduce((result, letter, i, arr) => {
      const regex = letter === '-' ? regexp(arr[i + 1]) : regexp(letter);
      if (currentValue.charAt(i).match(regex))
        return result + currentValue.charAt(i);
      return result;
    }, initialValue);
  };
};
