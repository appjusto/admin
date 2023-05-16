const STORE_ID_REGEX =
  /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/gm;

export const isStoreIdValid = (storeId: string) => {
  const match = STORE_ID_REGEX.exec(storeId);
  if (!match) return false;
  return true;
};
