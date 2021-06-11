import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { BankAccount, Business, ManagerProfile } from 'appjusto-types';
import { useMutation } from 'react-query';

export const useBusinessManagerAndBankAccountBatch = () => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId()!;
  const { manager } = useContextManagerProfile();

  // mutations
  const [
    updateBusinessManagerAndBankAccount,
    updateResult,
  ] = useMutation(
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
        )
  );
  return { updateBusinessManagerAndBankAccount, updateResult };
};
