export const formattComplaintDate = (date?: string) => {
  if (!date) return 'N/E';
  const arr = date.split('');
  arr.splice(2, 0, '/');
  const formatted = arr.join().replaceAll(',', '');
  return formatted;
};
