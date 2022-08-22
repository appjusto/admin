import { BankAccount, Business, ManagerProfile } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';

export const useBusinessManagerAndBankAccountBatch = () => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const { manager } = useContextManagerProfile();
  // mutations
  const {
    mutateAsync: updateBusinessManagerAndBankAccount,
    mutationResult: updateResult,
  } = useCustomMutation(
    async (changes: {
      businessChanges: Partial<Business> | null;
      managerChanges: Partial<ManagerProfile> | null;
      bankingChanges: Partial<BankAccount> | null;
    }) =>
      api
        .business()
        .updateBusinessManagerAndBankAccountBatch(
          businessId,
          changes.businessChanges,
          manager?.id!,
          changes.managerChanges,
          changes.bankingChanges
        ),
    'updateBusinessManagerAndBankAccount'
  );
  return { updateBusinessManagerAndBankAccount, updateResult };
};
