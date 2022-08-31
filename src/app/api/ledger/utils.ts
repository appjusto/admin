import { LedgerEntry, WithId } from '@appjusto/types';

export const getLedgerEntriesTotalValue = (entries: WithId<LedgerEntry>[]) => {
  return entries.reduce((result, entry) => {
    return result + entry.value;
  }, 0);
};
