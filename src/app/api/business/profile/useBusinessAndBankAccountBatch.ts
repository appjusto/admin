import { BankAccount, Business } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';

export const useBusinessAndBankAccountBatch = (businessId?: string) => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: updateBusinessAndBankAccount,
    mutationResult: updateResult,
  } = useCustomMutation(
    async (changes: {
      businessChanges: Partial<Business> | null;
      bankingChanges: Partial<BankAccount> | null;
    }) =>
      api
        .business()
        .updateBusinessAndBankAccountBatch(
          businessId!,
          changes.businessChanges,
          changes.bankingChanges
        ),
    'updateBusinessAndBankAccount'
  );
  return { updateBusinessAndBankAccount, updateResult };
};
