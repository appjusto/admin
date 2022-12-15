import { LedgerEntry, WithId } from '@appjusto/types';

export const getLedgerEntriesTotalValue = (entries: WithId<LedgerEntry>[]) => {
  return entries.reduce((result, entry) => {
    const fee = entry.processingFee ?? 0;
    return result + entry.value + fee;
  }, 0);
};
export const getLedgerEntriesTotalRawValue = (
  entries: WithId<LedgerEntry>[]
) => {
  return entries.reduce((result, entry) => {
    return result + entry.value;
  }, 0);
};
export const getLedgerEntriesIuguTotalValue = (
  entries: WithId<LedgerEntry>[]
) => {
  return entries.reduce((result, entry) => {
    const fee = entry.processingFee ?? 0;
    return result + fee;
  }, 0);
};
