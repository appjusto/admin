export const safeParseInt = (value: string, fallback: number) => {
  const valueAsInt = parseInt(value);
  if (!isNaN(valueAsInt)) return valueAsInt;
  return fallback;
}