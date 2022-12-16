import { LedgerEntry, LedgerEntryOperation, WithId } from '@appjusto/types';

export const getLedgerEntriesTotalValueByOperation = (
  entries: WithId<LedgerEntry>[],
  operation: LedgerEntryOperation
) => {
  const operationEntries = entries.filter(
    (entry) => entry.operation === operation
  );
  return operationEntries.reduce((result, entry) => {
    let fee = 0;
    if (operation === 'delivery') {
      fee = entry.processingFee ?? 0;
    }
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
export const getLedgerEntriesTotalFee = (
  entries: WithId<LedgerEntry>[],
  operations: LedgerEntryOperation[] = ['delivery']
) => {
  const operationsEntries = entries.filter((entry) =>
    operations.includes(entry.operation)
  );
  return operationsEntries.reduce((result, entry) => {
    const fee = entry.processingFee ?? 0;
    return result + fee;
  }, 0);
};
