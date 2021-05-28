export const use = (ns: string) => {
  const getObject = <T>(key: string) => {
    try {
      const o = localStorage.getItem(`${ns}/${key}`);
      if (!o) return null;
      return JSON.parse(o) as T;
    } catch (error) {
      return null;
    }
  };

  const setObject = <T>(key: string, value: T) => {
    try {
      return localStorage.setItem(`${ns}/${key}`, JSON.stringify(value));
    } catch (error) {}
  };

  const removeObject = (key: string) => {
    try {
      return localStorage.removeItem(`${ns}/${key}`);
    } catch (error) {}
  };
  return { getObject, setObject, removeObject };
};
