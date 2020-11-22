export const arrayMove = <T>(array: T[], from: number, to: number) => {
  const value = array[from];
  if (to > from) {
    return [
      ...array.slice(0, from),
      ...array.slice(from + 1, to + 1),
      value,
      ...array.slice(to + 1),
    ];
  } else {
    return [...array.slice(0, to), value, ...array.slice(to, from), ...array.slice(from + 1)];
  }
};
