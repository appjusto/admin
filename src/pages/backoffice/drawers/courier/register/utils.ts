export const birthdayFormatter = (
  to: 'string' | 'date' | 'display',
  value?: string
) => {
  if (!value) return '';
  if (to === 'date') {
    return `${value.slice(4, 8)}-${value.slice(2, 4)}-${value.slice(0, 2)}`;
  } else if (to === 'display') {
    return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
  const splited = value.split('-');
  return `${splited[2] + splited[1] + splited[0]}`;
};
